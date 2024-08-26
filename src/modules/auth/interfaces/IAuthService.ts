import { AxiosRequestConfig } from 'axios';

import { IRefreshSessionResponse } from './IRefreshSessionResponse';
import { ISignInResponse } from './ISignInResponse';
import { ISignUpResponse } from './ISignUpResponse';
import { ISuccessfulAuthenticationResponse } from './ISuccessfulAuthenticationResponse';

export interface IAuthService {
	signUp: (
		username: string,
		password: string,
		config?: AxiosRequestConfig,
	) => Promise<ISignUpResponse>;
	signIn: (
		username: string,
		password: string,
		config?: AxiosRequestConfig,
	) => Promise<ISignInResponse>;
	confirmUser: (
		username: string,
		code: string,
		config?: AxiosRequestConfig,
	) => Promise<ISuccessfulAuthenticationResponse>;
	resetPassword: (
		username: string,
		newPassword: string,
		code: string,
		config?: AxiosRequestConfig,
	) => Promise<ISuccessfulAuthenticationResponse>;
	resendConfirmationCode: (
		username: string,
		config?: AxiosRequestConfig,
	) => Promise<ISuccessfulAuthenticationResponse>;
	forgotPassword: (
		username: string,
		config?: AxiosRequestConfig,
	) => Promise<ISuccessfulAuthenticationResponse>;
	refreshToken: (
		username: string,
		refreshToken: string,
		config?: AxiosRequestConfig,
	) => Promise<IRefreshSessionResponse>;
	changePassword(
		proposedPassword: string,
		previousPassword: string,
		config?: AxiosRequestConfig,
	): Promise<ISuccessfulAuthenticationResponse>;
}
