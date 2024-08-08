export interface ILoadingState {
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

export type ActionType = 'SET_LOADING';
export const SET_LOADING = 'SET_LOADING';

export interface Action {
	type: ActionType;
	payload: keyof ILoadingState;
	value: boolean | string | string[] | null;
}
