import { useCallback, useReducer } from 'react';

import { IErrorState } from '../interfaces/IErrorState';
import { Action, SET_LOADING } from '../interfaces/ILoadingState';

const initialState: IErrorState = {
	signIn: null,
	signUp: null,
	forgotPassword: null,
	resendConfirmationCode: null,
	confirmUser: null,
	confirmPassword: null,
	refreshSession: null,
	signOut: null,
	resetPassword: null,
};

function reducer(state: IErrorState, action: Action): IErrorState {
	const actionHandlers = {
		[SET_LOADING]: () => ({ ...initialState, [action.payload]: action.value }),
	};

	const actionHandler = actionHandlers[action.type] || (() => state);
	return actionHandler();
}

export function useErrorState() {
	const [errorState, dispatch] = useReducer(reducer, initialState);

	const setErrorState = useCallback(
		(
			errorType: keyof IErrorState,
			value: boolean | string | string[] | null,
		) => {
			dispatch({ type: SET_LOADING, payload: errorType, value });
		},
		[],
	);

	return { errorState, setErrorState };
}
