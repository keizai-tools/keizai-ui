export const UNRECOGNIZED_TOKEN_ERROR = 'Unrecognized token error';
export const SIGN_IN_SUCCESS_MESSAGE = 'Sign in successful';
export const SIGN_UP_SUCCESS_MESSAGE = 'Sign up successful';
export const CONFIRMATION_SENT_MESSAGE =
	'An e-mail has been sent to your address to confirm your account.';
export const SIGN_OUT_SUCCESS_MESSAGE = 'You have successfully signed out.';

export enum AUTH_VALIDATIONS {
	CODE_INVALID = 'Must be 6 character long and only contain numbers. E.g. 123456',
	CODE_REQUIRED = 'Code is required',
	CONFIRM_PASSWORD_REQUIRED = 'Confirm password is required',
	CONFIRM_PASSWORD_NOT_MATCH = 'Passwords do not match',
	EMAIL_INVALID = 'Enter in the format: name@example.com',
	EMAIL_REQUIRED = 'Email is required',
	NEW_PASSWORD_REQUIRED = 'New password is required',
	OLD_PASSWORD_REQUIRED = 'Old password is required',
	PASSWORD_INVALID = 'Your password must be at least',
	PASSWORD_REQUIRED = 'Password is required',
}

export enum AUTH_RESPONSE {
	INVALID_PARAMETER = 'One of the parameters is invalid. Please verify your credentials and try again',
	INTERNAL_ERROR = 'Authentication Service internal error, please try again',
	REQUEST_EXPIRED = 'The request has expired, please try again',
	SERVICE_UNAVAILABLE = 'Temporary failure of the server, please try again',
	TOO_MANY_REQUEST = "Please don't submit the request too many times. Wait a moment and try again",
	PASSWORD_CHANGE_FAILED = 'Failed to change the password. Please verify that the email and the old password are correct',
	PASSWORD_CHANGED = 'You have changed your password',
	DEFAULT = "We couldn't communicate with Authentication Service. Please try again.",
}

export enum AUTH_LOGIN_RESPONSE {
	INVALID_PASSWORD = "Sorry, that password isn't right. Follow the detailed requirements below",
	NOT_AUTHORIZED = 'The email and password you entered did not match our records. Please double-check and try again',
	PASSWORD_RESET_REQUIRED = 'Password reset is required. Please click in Forgot your password? to continue',
	USER_NOT_CONFIRMED = 'The user is not confirmed, please verify your email',
	USER_NOT_FOUND = 'The user is not found. Can we help you register your email?',
}

export enum CREATE_ACCOUNT_RESPONSE {
	INVALID_PASSWORD = "Sorry, that password isn't right. Follow the detailed requirements below",
	NOT_AUTHORIZED = 'There was an error creating your account, please try again',
	USERNAME_EXIST = 'Another user with this email already exists. Can we help you recover your email or reset the password?',
}

export enum FORGOT_PASSWORD_RESPONSE {
	CODE_CONFIRMATION_INVALID = 'Invalid confirmation code. Please resend code or verify the email is correct',
	CODE_DELIVERY_FAILURE = 'The verification code was not delivered correctly. Please resend code',
	CODE_EXPIRED = 'Confirmation code expired. Please resend code',
	INVALID_PASSWORD = "Sorry, one of your passwords isn't right. Follow the detailed requirements below",
	NOT_AUTHORIZED = 'The email and code you entered did not match our records. Please double-check and try again',
	USER_NOT_FOUND = 'The user is not found. Please verify that the code you enter or the email are correct',
}

export enum CHANGE_PASSWORD_RESPONSE {
	INVALID_PASSWORD = "Sorry, one of your passwords isn't right. Follow the detailed requirements below",
	NOT_AUTHORIZED = 'The email and old password you entered did not match our records. Please double-check and try again',
	PASSWORD_RESET_REQUIRED = 'Password reset is required. Can we help you recover your password?',
	USER_NOT_CONFIRMED = 'The user is not confirmed, please verify your email',
	USER_NOT_FOUND = 'The user is not found. Can we help you register your email?',
}

export enum COGNITO_EXCEPTION {
	CODE_DELIVERY_FAILURE = 'CodeDeliveryFailureException',
	CODE_EXPIRED = 'ExpiredCodeException',
	CODE_CONFIRMATION_INVALID = 'CodeMismatchException',
	INVALID_PARAMETER = 'InvalidParameterException',
	INVALID_PASSWORD = 'InvalidPasswordException',
	INTERNAL_ERROR = 'InternalErrorException',
	NOT_AUTHORIZED = 'NotAuthorizedException',
	PASSWORD_RESET_REQUIRED = 'PasswordResetRequiredException',
	REQUEST_EXPIRED = 'RequestExpired',
	SERVICE_UNAVAILABLE = 'ServiceUnavailable',
	TOO_MANY_REQUEST = 'TooManyRequestsException',
	USERNAME_EXIST = 'UsernameExistsException',
	USER_NOT_CONFIRMED = 'UserNotConfirmedException',
	USER_NOT_FOUND = 'UserNotFoundException',
}
