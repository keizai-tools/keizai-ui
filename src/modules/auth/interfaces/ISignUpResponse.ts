export interface ISignUpResponse {
	success: boolean;
	path: string;
	payload: {
		createdAt: string;
		updatedAt: string;
		email: string;
		externalId: string;
		id: string;
		roles: string[];
	};
	statusCode: number;
	timestamp: string;
}
