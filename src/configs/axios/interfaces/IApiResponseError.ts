export interface IApiResponseError {
	success: boolean;
	statusCode: number;
	error: string;
	message: string;
	details: {
		description: string | string[];
		possibleCauses: string[];
		suggestedFixes: string[];
	};
	timestamp: string;
	path: string;
}
