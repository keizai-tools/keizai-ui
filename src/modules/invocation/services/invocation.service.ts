import { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { apiService } from '@/config/axios/services/api.service';

export class InvocationService {
	private collectionId: string;
	invocationResponse?: string;

	constructor(collectionId: string) {
		this.collectionId = collectionId;
	}

	async setEnviromentVariable(name: string, value: string) {
		return await apiService
			?.post<IApiResponse<unknown>>('/environment', {
				name,
				value,
				collectionId: this.collectionId,
			})
			.then((res) => {
				return res.payload;
			});
	}

	async clearEnviromentVariable(name: string) {
		return await apiService
			?.delete<IApiResponse<unknown>>(
				`/environment?name=${name}&collectionId=${this.collectionId}`,
			)
			.then((res) => {
				return res.payload;
			});
	}

	async clearAllEnviromentVariables() {
		return await apiService
			?.delete<IApiResponse<unknown>>(
				`/collection/${this.collectionId}/environments`,
			)
			.then((res) => {
				return res.payload;
			});
	}

	async getCollectionVariableValue(name: string) {
		return await apiService
			?.get<IApiResponse<unknown>>(
				`/collection/${this.collectionId}/environment?name=${name}`,
			)
			.then((res) => {
				return res.payload;
			});
	}

	async getInvocationByCollectionId() {
		return await apiService
			?.get<IApiResponse<unknown>>(
				`/collection/${this.collectionId}/invocations`,
			)
			.then((res) => {
				return res.payload;
			});
	}

	getInvocationResponse() {
		return this.invocationResponse;
	}
}
