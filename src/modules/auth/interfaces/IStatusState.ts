export interface IStatusState {
	signIn: boolean;
	signUp: boolean;
	forgotPassword: boolean;
	resendConfirmationCode: boolean;
	confirmUser: boolean;
	confirmPassword: boolean;
	refreshSession: boolean;
	signOut: boolean;
	resetPassword: boolean;
}

export type ActionType = 'SET_STATUS';
export const SET_STATUS = 'SET_STATUS';

export interface Action {
	type: ActionType;
	payload: keyof IStatusState;
	value: boolean | string | string[] | null;
}
