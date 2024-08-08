export interface IRefreshSessionResponse {
	success: boolean;
	path: string;
	payload: {
		accessToken: string;
	};
	statusCode: number;
	timestamp: string;
}
