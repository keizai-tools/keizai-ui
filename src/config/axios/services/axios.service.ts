import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from 'axios';
import Cookies from 'universal-cookie';

import { ApiResponseError } from '../errors/ApiResponseError';
import { IApiResponseError } from '../interfaces/IApiResponseError';
import { IHTTPRequestService } from '../interfaces/IHTTPRequestService';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');
const refreshToken = cookies.get('refreshToken');
const email = cookies.get('email');

function createErrorHandler(instance: AxiosInstance) {
	return async function handleAxiosError(
		error: Error | AxiosError<IApiResponseError>,
	): Promise<AxiosResponse> {
		if (!axios.isAxiosError<IApiResponseError>(error) || !error.response) {
			return Promise.reject(new Error(error.message));
		}

		const originalRequest = error.config;
		const shouldRefresh =
			error.response.status === 401 &&
			error.response.data.error === 'TokenExpired';

		if (shouldRefresh && originalRequest) {
			try {
				const refreshResponse = await instance.post<{
					accessToken: string;
				}>('/auth/refresh', {
					email,
					refreshToken,
				});
				const newAccessToken = refreshResponse.data.accessToken;
				cookies.set('accessToken', newAccessToken, { path: '/' });

				const authorization = `Bearer ${newAccessToken}`;
				instance.defaults.headers.common['Authorization'] = authorization;
				originalRequest.headers['Authorization'] = authorization;

				return instance(originalRequest);
			} catch (refreshError) {
				if (refreshError instanceof Error) {
					return Promise.reject(new Error(refreshError.message));
				} else {
					return Promise.reject(
						new Error('Unknown error during token refresh'),
					);
				}
			}
		}

		return Promise.reject(
			new ApiResponseError({
				error: error.response.data.error,
				message: error.response.data.message,
				statusCode: error.response.data.statusCode,
				success: error.response.data.success,
				details: error.response.data.details,
				timestamp: error.response.data.timestamp,
				path: error.response.data.path,
			}),
		);
	};
}

const axiosInstance: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_URL_API_BASE,
	headers: {
		common: { Authorization: `Bearer ${accessToken}` },
	},
});

axiosInstance.interceptors.response.use(
	(response) => response,
	createErrorHandler(axiosInstance),
);

function createAxiosService(
	instance: AxiosInstance,
): IHTTPRequestService<AxiosRequestConfig> {
	return {
		get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
			const response = await instance.get<T>(url, config);
			return response.data;
		},

		post: async <T, K = unknown>(
			url: string,
			body: K,
			config?: AxiosRequestConfig,
		): Promise<T> => {
			const response = await instance.post<T>(url, body, config);
			return response.data;
		},

		patch: async <T, K = unknown>(
			url: string,
			body: K,
			config?: AxiosRequestConfig,
		): Promise<T> => {
			const response = await instance.patch<T>(url, body, config);
			return response.data;
		},

		put: async <T, K = unknown>(
			url: string,
			body: K,
			config?: AxiosRequestConfig,
		): Promise<T> => {
			const response = await instance.put<T>(url, body, config);
			return response.data;
		},

		delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
			const response = await instance.delete<T>(url, config);
			return response.data;
		},

		setAuthentication: (token: string) => {
			instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			return token;
		},

		getAuthentication: () => {
			return instance.defaults.headers.common['Authorization'];
		},
	};
}

export const axiosService = createAxiosService(axiosInstance);
