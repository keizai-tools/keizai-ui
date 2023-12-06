import { AxiosInstance } from 'axios';
import { Component } from 'react';

import { Invocation } from '@/common/types/invocation';

interface IKeizai {
	clearEnviromentVariable: (name: string, collectionId: string) => void;
	setEnviromentVariable: (
		name: string,
		value: string,
		collectionId: string,
	) => void;
	clearAllEnviromentVariables: (collectionId: string) => void;
}

export class Keizai extends Component implements IKeizai {
	axios: AxiosInstance;
	invocation: Invocation;
	constructor({
		axios,
		invocation,
	}: {
		axios: AxiosInstance;
		invocation: Invocation;
	}) {
		super({ axios, invocation });
		this.axios = axios;
		this.invocation = invocation;
	}

	clearEnviromentVariable(name: string, collectionId: string) {
		this.axios
			?.delete(`/environment`, {
				headers: {
					name,
					collectionId,
				},
			})
			.then((res) => res.data);
	}

	setEnviromentVariable(name: string, value: string, collectionId: string) {
		this.axios
			?.post(`/environment`, {
				name,
				value,
				collectionId,
			})
			.then((res) => res.data);
	}

	clearAllEnviromentVariables(collectionId: string) {
		this.axios
			?.delete(`/environments`, {
				headers: {
					collectionId,
				},
			})
			.then((res) => res.data);
	}
}
