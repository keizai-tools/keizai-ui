export class KeizaiService {
	private accessToken: string;
	private collectionId: string;
	private apiUrl: string;

	constructor(accessToken: string, collectionId: string, apiUrl: string) {
		this.accessToken = accessToken;
		this.collectionId = collectionId;
		this.apiUrl = apiUrl;
	}

	async setEnviromentVariable(name: string, value: string) {
		await fetch(this.apiUrl + '/environment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
			body: JSON.stringify({
				name,
				value,
				collectionId: this.collectionId,
			}),
		});
	}

	async clearEnviromentVariable(name: string) {
		await fetch(
			this.apiUrl +
				`/environment?name=${name}&collectionId=${this.collectionId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.accessToken}`,
				},
			},
		);
	}

	async clearAllEnviromentVariables() {
		await fetch(this.apiUrl + `/collection/${this.collectionId}/environments`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
		});
	}

	async getCollectionVariableValue(name: string) {
		return await fetch(
			this.apiUrl + `/collection/${this.collectionId}/environment?name=${name}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.accessToken}`,
				},
			},
		).then((res) => res.json().then((data) => data.value));
	}
}
