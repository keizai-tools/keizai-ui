import { MessageEventType } from '../constants/enums';
import {
	ConfigType,
	IConnectMessage,
	ISignMessage,
	SimpleSignerResponse,
} from '../types';
import openPopup from './open-popup';

import { ApiResponseError } from '@/config/axios/errors/ApiResponseError';

async function messageHandler<T extends ISignMessage | IConnectMessage>({
	url,
	origin,
	...postConfig
}: ConfigType<T>): Promise<SimpleSignerResponse<T>> {
	const popupWindow = openPopup(url, '_blank');

	return new Promise((resolve, reject) => {
		let ready = false;

		const timeout = setTimeout(() => {
			if (!ready) {
				reject(
					new ApiResponseError({
						error: 'Timeout',
						message: 'The operation timed out.',
						details: {
							description:
								'The process did not complete within the allotted time.',
							possibleCauses: [
								'The user took too long to respond.',
								'Network issues or slow connection.',
							],
							suggestedFixes: [
								'Ensure the user has enough time to complete the operation.',
								'Check the network connection and try again.',
							],
						},
						path: url,
						statusCode: 408,
						success: false,
						timestamp: new Date().toISOString(),
					}),
				);
				window.removeEventListener('message', handleMessage);
			}
		}, 5000);

		const checkPopupClosed = setInterval(() => {
			if (popupWindow.closed) {
				reject(
					new ApiResponseError({
						error: 'Popup Closed',
						message: 'The popup window was closed unexpectedly.',
						details: {
							description:
								'The popup window was closed before the process could complete.',
							possibleCauses: [
								'The user manually closed the popup.',
								'The popup was blocked by the browser or security settings.',
							],
							suggestedFixes: [
								'Ask the user not to close the popup until the operation is complete.',
								'Verify if the popup was blocked by the browser settings and adjust if necessary.',
							],
						},
						path: url,
						statusCode: 400,
						success: false,
						timestamp: new Date().toISOString(),
					}),
				);
				clearInterval(checkPopupClosed);
				clearTimeout(timeout);
				window.removeEventListener('message', handleMessage);
			}
		}, 1000);

		function handleMessage(e: MessageEvent<SimpleSignerResponse<T>>) {
			if (e.origin === origin) {
				const messageResponse = e.data;

				const handlers: { [key: string]: () => void } = {
					[MessageEventType.READY]: () => {
						ready = true;
						popupWindow.postMessage(postConfig, origin);
						clearTimeout(timeout);
					},
					[MessageEventType.CANCEL]: () => {
						reject(
							new ApiResponseError({
								error: 'User Cancelled',
								message: 'The user cancelled the operation.',
								details: {
									description: 'The user chose to cancel the process.',
									possibleCauses: [
										'The user pressed cancel or closed the popup.',
									],
									suggestedFixes: [
										'Inform the user about the consequences of cancellation.',
										'Provide an option to retry the process.',
									],
								},
								path: url,
								statusCode: 499,
								success: false,
								timestamp: new Date().toISOString(),
							}),
						);
						clearInterval(checkPopupClosed);
						window.removeEventListener('message', handleMessage);
					},
					default: () => {
						resolve(messageResponse);
						clearInterval(checkPopupClosed);
						window.removeEventListener('message', handleMessage);
					},
				};

				(handlers[messageResponse.type] || handlers['default'])();
			}
		}
		window.addEventListener('message', handleMessage);
	});
}

export default messageHandler;
