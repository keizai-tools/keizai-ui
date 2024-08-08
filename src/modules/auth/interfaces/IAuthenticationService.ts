import { IRefreshSessionResponse } from './IRefreshSessionResponse';
import { ISignInResponse } from './ISignInResponse';
import { ISignUpResponse } from './ISignUpResponse';
import { ISuccessfulAuthenticationResponse } from './ISuccessfulAuthenticationResponse';

export interface IAuthenticationService {
	signUp: (username: string, password: string) => Promise<ISignUpResponse>;
	signIn: (username: string, password: string) => Promise<ISignInResponse>;
	forgotPassword: (
		username: string,
	) => Promise<ISuccessfulAuthenticationResponse>;
	confirmPassword: (
		username: string,
		newPassword: string,
		code: string,
	) => Promise<ISuccessfulAuthenticationResponse>;
	confirmUser: (
		username: string,
		code: string,
	) => Promise<ISuccessfulAuthenticationResponse>;
	resendConfirmationCode: (
		username: string,
		code: string,
	) => Promise<ISuccessfulAuthenticationResponse>;
	refreshToken: (
		username: string,
		refreshToken: string,
	) => Promise<IRefreshSessionResponse>;
}
