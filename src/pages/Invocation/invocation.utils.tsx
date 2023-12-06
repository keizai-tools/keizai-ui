import { AxiosError, isAxiosError } from 'axios';
import { AlertCircle, ChevronRight } from 'lucide-react';

import { ApiError, isApiError } from '@/common/hooks/useAxios';
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

export const createContractResponsePreInvocation = (
	preInvocation: string | undefined,
) => {
	if (!preInvocation) {
		return;
	}

	return (
		<span className="flex items-center gap-1 tracking-wider">
			<ChevronRight className="text-primary" size={16} />
			<span className="text-primary font-semibold">Pre invocation result:</span>
			<span>{preInvocation}</span>
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
					'There was a problem running the invocation',
			};
		}
	}

	return {
		isError: true,
		title: 'Error',
		message: 'There was an unexpected error',
	};
};
