import { AxiosRequestConfig } from 'axios';

import { IApiService } from '../interfaces/IApiService';
import { IHTTPRequestService } from '../interfaces/IHTTPRequestService';
import { axiosService } from './axios.service';

class ApiService<C = unknown> implements IApiService<C> {
	httpService: IHTTPRequestService<C>;

	constructor(httpService: IHTTPRequestService<C>) {
		this.httpService = httpService;
	}
	get<T>(url: string, config?: C): Promise<T> {
		return this.httpService.get<T>(url, config);
	}
	post<T = unknown, K = unknown>(url: string, body: K, config?: C): Promise<T> {
		return this.httpService.post<T>(url, body, config);
	}
	patch<T = unknown, K = unknown>(
		url: string,
		body: K,
		config?: C,
	): Promise<T> {
		return this.httpService.patch<T>(url, body, config);
	}
	put<T = unknown, K = unknown>(url: string, body: K, config?: C): Promise<T> {
		return this.httpService.put<T>(url, body, config);
	}
	delete<T = unknown>(url: string, config?: C): Promise<T> {
		return this.httpService.delete<T>(url, config);
	}
	setAuthentication(token: string) {
		return this.httpService.setAuthentication(token);
	}
	getAuthentication() {
		return this.httpService.getAuthentication();
	}
}

export const apiService = new ApiService<AxiosRequestConfig>(axiosService);
