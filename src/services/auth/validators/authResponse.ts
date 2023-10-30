export enum AUTH_RESPONSE {
	CODE_DELIVERY_FAILURE = 'The verification code was not delivered correctly',
	EXPIRED_CODE = 'The code has expired',
	FAILED_LOGIN = 'Failed to login',
	FAILED_LOGOUT = 'Failed to logout',
	FAILED_REGISTER = 'There was an error creating your account, please try again',
	INTERNAL_ERROR = 'Amazon Cognito internal error, please try again',
	INVALID_PARAMETER = 'One of the parameters entered is invalid',
	INVALID_PASSWORD = 'Please enter a valid password',
	NOT_AUTHORIZED = 'Invalid email or password',
	REQUEST_EXPIRED = 'The request has expired, please try again',
	SERVICE_UNAVAILABLE = 'Temporary failure of the server, please try again',
	TOO_MANY_REQUEST = "Please don't submit the request too many times",
	USERNAME_EXIST = 'The email is already registered',
	USER_NOT_CONFIRMED = 'The user is not confirmed',
	USER_NOT_FOUND_OR_EXIST = 'The user is not found or not exist',
}

export enum COGNITO_EXCEPTION {
	CODE_DELIVERY_FAILURE = 'CodeDeliveryFailureException',
	EXPIRED_CODE = 'ExpiredCodeException',
	INVALID_PARAMETER = 'InvalidParameterException',
	INVALID_PASSWORD = 'InvalidPasswordException',
	INTERNAL_ERROR = 'InternalErrorException',
	NOT_AUTHORIZED = 'NotAuthorizedException',
	REQUEST_EXPIRED = 'RequestExpired',
	SERVICE_UNAVAILABLE = 'ServiceUnavailable',
	TOO_MANY_REQUEST = 'TooManyRequestsException',
	USERNAME_EXIST = 'UsernameExistsException',
	USER_NOT_CONFIRMED = 'UserNotConfirmedException',
	USER_NOT_FOUND = 'UserNotFoundException',
}

export enum AUTH_VALIDATIONS {
	CODE_REQUIRED = 'Code is required',
	CONFIRM_PASSWORD_REQUIRED = 'Confirm password is required',
	CONFIRM_PASSWORD_NOT_MATCH = 'Passwords do not match',
	EMAIL_INVALID = 'Invalid email address',
	EMAIL_REQUIRED = 'Email is required',
	PASSWORD_INVALID = 'The password must consist of at least 8 alphanumeric characters and alternate between uppercase, lowercase, and special characters',
	PASSWORD_REQUIRED = 'Password is required',
}
