export class KeizaiService {
	private accessToken: string;
	private collectionId: string;
	private apiUrl: string;

	constructor(accessToken: string, collectionId: string, apiUrl: string) {
		this.accessToken = accessToken;
		this.collectionId = collectionId;
		this.apiUrl = apiUrl;
	}

	setEnviromentVariable(name: string, value: string) {
		fetch(this.apiUrl + '/environment', {
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

	clearEnviromentVariable(name: string) {
		fetch(
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

	clearAllEnviromentVariables() {
		fetch(this.apiUrl + `/collection/${this.collectionId}/environments`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
		});
	}
}
