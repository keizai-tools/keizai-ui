export type ErrorValue = string[] | string | null;

export interface IErrorState {
	signIn: ErrorValue;
	signUp: ErrorValue;
	forgotPassword: ErrorValue;
	resendConfirmationCode: ErrorValue;
	confirmUser: ErrorValue;
	confirmPassword: ErrorValue;
	refreshSession: ErrorValue;
	signOut: ErrorValue;
	resetPassword: ErrorValue;
}

export type ActionType = 'SET_ERROR';
export const SET_ERROR = 'SET_ERROR';

export interface Action {
	type: ActionType;
	payload: keyof IErrorState;
	value: boolean;
}
