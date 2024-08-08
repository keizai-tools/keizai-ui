import { AxiosRequestConfig } from 'axios';

import { IAuthService } from '../interfaces/IAuthService';
import { IRefreshSessionResponse } from '../interfaces/IRefreshSessionResponse';
import { ISignInResponse } from '../interfaces/ISignInResponse';
import { ISignUpResponse } from '../interfaces/ISignUpResponse';
import { ISuccessfulAuthenticationResponse } from '../interfaces/ISuccessfulAuthenticationResponse';

import { IApiService } from '@/configs/axios/interfaces/IApiService';
import { apiService } from '@/configs/axios/services/api.service';

class AuthService implements IAuthService {
	api: IApiService<AxiosRequestConfig>;
	constructor(api: IApiService<AxiosRequestConfig>) {
		this.api = api;
	}

	async signUp(email: string, password: string, config?: AxiosRequestConfig) {
		return await this.api.post<ISignUpResponse>(
			'/auth/register',
			{ email, password },
			config,
		);
	}

	async signIn(email: string, password: string, config?: AxiosRequestConfig) {
		return await this.api.post<ISignInResponse>(
			'/auth/login',
			{ email, password },
			config,
		);
	}

	async confirmUser(email: string, code: string, config?: AxiosRequestConfig) {
		return await this.api.post<ISuccessfulAuthenticationResponse>(
			'/auth/confirm-user',
			{ email, code },
			config,
		);
	}
	async confirmPassword(
		email: string,
		newPassword: string,
		code: string,
		config?: AxiosRequestConfig,
	) {
		return await this.api.post<ISuccessfulAuthenticationResponse>(
			'/auth/confirm-password',
			{ email, newPassword, code },
			config,
		);
	}
	async resendConfirmationCode(email: string, config?: AxiosRequestConfig) {
		return await this.api.post<ISuccessfulAuthenticationResponse>(
			'/auth/resend-confirmation-code',
			{ email },
			config,
		);
	}
	async forgotPassword(email: string, config?: AxiosRequestConfig) {
		return await this.api.post<ISuccessfulAuthenticationResponse>(
			'/auth/forgot-password',
			{ email },
			config,
		);
	}
	async refreshToken(
		email: string,
		refreshToken: string,
		config?: AxiosRequestConfig,
	) {
		return await this.api.post<IRefreshSessionResponse>(
			'/auth/refresh',
			{ email, refreshToken },
			config,
		);
	}

	async resetPassword(
		email: string,
		newPassword: string,
		code: string,
		config?: AxiosRequestConfig,
	) {
		return await this.api.post<ISuccessfulAuthenticationResponse>(
			'/auth/reset-password',
			{ email, newPassword, code },
			config,
		);
	}
}

export const authService = new AuthService(apiService);
