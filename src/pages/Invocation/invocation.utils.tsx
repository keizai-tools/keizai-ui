import { AxiosError, isAxiosError } from 'axios';
import { AlertCircle, ChevronRight } from 'lucide-react';

import {
	INVOCATION_RESPONSE,
	STATUS,
	transactionResultCode,
} from '@/common/exceptions/invocations';
import { ApiError, isApiError } from '@/common/hooks/useAxios';
import { InvocationResponse } from '@/common/types/invocation';
import { Method } from '@/common/types/method';

const createContractResponseParam = (params: Method['params']) => {
	return params.map((param, index) => {
		const isLastParam = params.length - 1 === index;
		return (
			<span
				key={param.name}
				className={`text-slate-400 ${!isLastParam && 'mr-1'}`}
			>
				{param.name}: {param.value}
				{!isLastParam && ','}
			</span>
		);
	});
};

export const createContractResponseTitle = (method: Method) => {
	return (
		<span className="flex items-center gap-1 tracking-wider">
			<ChevronRight className="text-primary" size={16} />
			<span className="text-primary font-semibold">{method?.name}(</span>
			<div className={method.params.length === 0 ? 'hidden' : ''}>
				{createContractResponseParam(method.params)}
			</div>
			<span className="text-primary font-semibold">)</span>
		</span>
	);
};

export const createContractResponse = (
	serviceResponse: string | undefined,
	description: string,
) => {
	if (!serviceResponse) {
		return;
	}

	return (
		<span className="flex items-center gap-1 tracking-wider">
			<ChevronRight className="text-primary" size={16} />
			<span className="text-primary font-semibold">{description}</span>
			<span>{JSON.stringify(serviceResponse)}</span>
		</span>
	);
};

export const handleAxiosError = (error: unknown) => {
	if (isAxiosError(error)) {
		const axiosError = error as AxiosError;
		if (isApiError(axiosError.response?.data)) {
			return {
				isError: true,
				title: (
					<div className="flex items-center gap-2 text-red-500 font-semibold">
						<AlertCircle size={16} />
						Error
					</div>
				),
				message:
					(axiosError.response?.data as ApiError).message ||
					INVOCATION_RESPONSE.ERROR_RUN_INVOCATION,
			};
		}
	}

	return {
		isError: true,
		title: 'Error',
		message: INVOCATION_RESPONSE.ERROR_DEFAULT,
	};
};

export const failedRunContract = (response: string) => {
	return {
		isError: true,
		title: (
			<div className="flex items-center gap-2 text-red-500 font-semibold">
				<AlertCircle size={16} />
				Failed
			</div>
		),
		message:
			transactionResultCode[response as keyof typeof transactionResultCode] ??
			INVOCATION_RESPONSE.FAILED_RUN_CONTRACT,
	};
};

export const getInvocationResponse = (
	response: InvocationResponse,
	preInvocationResponse: string | undefined,
	postInvocationResponse: string | undefined,
) => {
	if (response && response.method) {
		switch (response.status) {
			case STATUS.SUCCESS:
				return {
					isError: false,
					preInvocation: createContractResponse(
						preInvocationResponse,
						'Pre-Invocation response',
					),
					postInvocation: createContractResponse(
						postInvocationResponse,
						'Post-Invocation response',
					),
					title: createContractResponseTitle(response.method),
					message: response.response || 'No response',
				};
			case STATUS.FAILED:
				return failedRunContract(response.response);
		}
	}

	if (response.status === 'ERROR' && response.title) {
		return {
			isError: true,
			title: (
				<div className="flex items-center gap-2 text-red-500 font-semibold">
					<AlertCircle size={16} />
					{response.title.charAt(0).toUpperCase() + response.title.slice(1)}
				</div>
			),
			message: (
				<pre className="text-xs pr-2 whitespace-pre-wrap">
					{response.response}
				</pre>
			),
		};
	}

	throw new Error();
};
