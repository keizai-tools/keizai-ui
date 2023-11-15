export class CognitoError extends Error {
	code: string;
	constructor(code: string) {
		super();
		this.code = code;
	}
}

export class BadRequestException {
	public message: string;
	public status: number;
	constructor(message: string) {
		this.status = 400;
		this.message = message;
	}
}

export class InternalServerErrorException {
	public message: string;
	public status: number;
	constructor(message: string) {
		this.status = 500;
		this.message = message;
	}
}
