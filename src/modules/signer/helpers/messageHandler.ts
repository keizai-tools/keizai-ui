import { MessageEventType } from '../constants/enums';
import {
  ConfigType,
  IConnectMessage,
  ISignMessage,
  SignerResponse,
} from '../types';
import openPopup from './openPopup';

async function messageHandler<T extends ISignMessage | IConnectMessage>({
  url,
  origin,
  ...postConfig
}: ConfigType<T>): Promise<SignerResponse<T>> {
  const popupWindow = openPopup(url, '_blank');

  return new Promise((resolve, reject) => {
    let ready = false;

    const timeout = setTimeout(() => {
      if (!ready) {
        reject(new Error('Window timeout'));
        window.removeEventListener('message', handleMessage);
      }
    }, 5000);

    function handleMessage(e: MessageEvent<SignerResponse<T>>) {
      if (e.origin === origin) {
        const messageResponse = e.data;

        const handlers: { [key: string]: () => void } = {
          [MessageEventType.READY]: () => {
            ready = true;
            popupWindow.postMessage(postConfig, origin);
            clearTimeout(timeout);
          },
          [MessageEventType.CANCEL]: () => {
            reject(new Error('User cancelled process'));
            window.removeEventListener('message', handleMessage);
          },
          default: () => {
            resolve(messageResponse);
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
