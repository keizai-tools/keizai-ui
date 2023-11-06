import {
	CognitoError,
	BadRequestException,
	InternalServerErrorException,
} from '../error/cognitoError';
import {
	AUTH_LOGIN_RESPONSE,
	AUTH_RESPONSE,
	CHANGE_PASSWORD_RESPONSE,
	COGNITO_EXCEPTION,
	CREATE_ACCOUNT_RESPONSE,
	FORGOT_PASSWORD_RESPONSE,
} from './authResponse';

const authLocation = {
	login: '/auth/login',
	createAccount: '/auth/register',
	forgotPassword: '/auth/reset-password',
	changePassword: '/change-password',
};

export interface IError {
	status: number;
	message: string;
}

const EMPTY_ERROR: IError = {
	status: 100,
	message: '',
};

export function exceptionsCognitoErrors(
	error: CognitoError,
): BadRequestException | InternalServerErrorException | IError {
	const pathname = window.location.pathname;
	const exception = error.code;

	let errorMessage:
		| BadRequestException
		| InternalServerErrorException
		| IError = EMPTY_ERROR;

	const handleErrorResponse = {
		[authLocation.login]: loginResponseError,
		[authLocation.createAccount]: createAccountResponseError,
		[authLocation.forgotPassword]: forgotPasswordResponseError,
		[authLocation.changePassword]: changePasswordResponseError,
	};

	const errorHandler = handleErrorResponse[pathname];
	errorMessage = errorHandler(exception);

	if (!errorMessage.message) {
		errorMessage = authResponseCommonError(exception);
	}
	return errorMessage;
}

function loginResponseError(exception: string) {
	switch (exception) {
		case COGNITO_EXCEPTION.INVALID_PASSWORD:
			return new BadRequestException(AUTH_LOGIN_RESPONSE.INVALID_PASSWORD);
		case COGNITO_EXCEPTION.NOT_AUTHORIZED:
			return new BadRequestException(AUTH_LOGIN_RESPONSE.NOT_AUTHORIZED);
		case COGNITO_EXCEPTION.PASSWORD_RESET_REQUIRED:
			return new BadRequestException(
				AUTH_LOGIN_RESPONSE.PASSWORD_RESET_REQUIRED,
			);
		case COGNITO_EXCEPTION.USER_NOT_CONFIRMED:
			return new BadRequestException(AUTH_LOGIN_RESPONSE.USER_NOT_CONFIRMED);
		case COGNITO_EXCEPTION.USER_NOT_FOUND:
			return new BadRequestException(AUTH_LOGIN_RESPONSE.USER_NOT_FOUND);
		default:
			return EMPTY_ERROR;
	}
}

function createAccountResponseError(exception: string) {
	switch (exception) {
		case COGNITO_EXCEPTION.INVALID_PASSWORD:
			return new BadRequestException(CREATE_ACCOUNT_RESPONSE.INVALID_PASSWORD);
		case COGNITO_EXCEPTION.NOT_AUTHORIZED:
			return new BadRequestException(CREATE_ACCOUNT_RESPONSE.NOT_AUTHORIZED);
		case COGNITO_EXCEPTION.USERNAME_EXIST:
			return new BadRequestException(CREATE_ACCOUNT_RESPONSE.USERNAME_EXIST);
		default:
			return EMPTY_ERROR;
	}
}

function forgotPasswordResponseError(exception: string) {
	switch (exception) {
		case COGNITO_EXCEPTION.CODE_CONFIRMATION_INVALID:
			return new BadRequestException(
				FORGOT_PASSWORD_RESPONSE.CODE_CONFIRMATION_INVALID,
			);
		case COGNITO_EXCEPTION.CODE_DELIVERY_FAILURE:
			return new BadRequestException(
				FORGOT_PASSWORD_RESPONSE.CODE_DELIVERY_FAILURE,
			);
		case COGNITO_EXCEPTION.CODE_EXPIRED:
			return new BadRequestException(FORGOT_PASSWORD_RESPONSE.CODE_EXPIRED);
		case COGNITO_EXCEPTION.INVALID_PASSWORD:
			return new BadRequestException(FORGOT_PASSWORD_RESPONSE.INVALID_PASSWORD);
		case COGNITO_EXCEPTION.NOT_AUTHORIZED:
			return new BadRequestException(FORGOT_PASSWORD_RESPONSE.NOT_AUTHORIZED);
		case COGNITO_EXCEPTION.USER_NOT_FOUND:
			return new BadRequestException(FORGOT_PASSWORD_RESPONSE.USER_NOT_FOUND);
		default:
			return EMPTY_ERROR;
	}
}

function changePasswordResponseError(exception: string) {
	switch (exception) {
		case COGNITO_EXCEPTION.INVALID_PASSWORD:
			return new BadRequestException(CHANGE_PASSWORD_RESPONSE.INVALID_PASSWORD);
		case COGNITO_EXCEPTION.NOT_AUTHORIZED:
			return new BadRequestException(CHANGE_PASSWORD_RESPONSE.NOT_AUTHORIZED);
		case COGNITO_EXCEPTION.PASSWORD_RESET_REQUIRED:
			return new BadRequestException(
				CHANGE_PASSWORD_RESPONSE.PASSWORD_RESET_REQUIRED,
			);
		case COGNITO_EXCEPTION.USER_NOT_CONFIRMED:
			return new BadRequestException(
				CHANGE_PASSWORD_RESPONSE.USER_NOT_CONFIRMED,
			);
		case COGNITO_EXCEPTION.USER_NOT_FOUND:
			return new BadRequestException(CHANGE_PASSWORD_RESPONSE.USER_NOT_FOUND);
		default:
			return EMPTY_ERROR;
	}
}

function authResponseCommonError(exception: string) {
	switch (exception) {
		case COGNITO_EXCEPTION.INVALID_PARAMETER:
			return new InternalServerErrorException(AUTH_RESPONSE.INVALID_PARAMETER);
		case COGNITO_EXCEPTION.INTERNAL_ERROR:
			return new InternalServerErrorException(AUTH_RESPONSE.INTERNAL_ERROR);
		case COGNITO_EXCEPTION.REQUEST_EXPIRED:
			return new InternalServerErrorException(AUTH_RESPONSE.REQUEST_EXPIRED);
		case COGNITO_EXCEPTION.SERVICE_UNAVAILABLE:
			return new InternalServerErrorException(
				AUTH_RESPONSE.SERVICE_UNAVAILABLE,
			);
		case COGNITO_EXCEPTION.TOO_MANY_REQUEST:
			return new InternalServerErrorException(AUTH_RESPONSE.TOO_MANY_REQUEST);
		default:
			return new InternalServerErrorException(AUTH_RESPONSE.DEFAULT);
	}
}
