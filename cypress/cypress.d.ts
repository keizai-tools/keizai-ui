export interface CognitoSignInResponse {
	keyPrefix: string;
	username: string;
	signInUserSession: {
		idToken: { jwtToken: string };
		accessToken: { jwtToken: string };
		refreshToken: { token: string };
		clockDrift: string;
	};
}
