import { useCallback, useReducer } from 'react';

import {
	SET_LOADING,
	Action,
	ILoadingState,
} from '../interfaces/ILoadingState';

const initialState: ILoadingState = {
	signIn: false,
	signUp: false,
	forgotPassword: false,
	resendConfirmationCode: false,
	confirmUser: false,
	confirmPassword: false,
	refreshSession: false,
	signOut: false,
	resetPassword: false,
};

function reducer(state: ILoadingState, action: Action): ILoadingState {
	const actionHandlers = {
		[SET_LOADING]: () => ({ ...initialState, [action.payload]: action.value }),
	};

	const actionHandler = actionHandlers[action.type] || (() => state);
	return actionHandler();
}

export function useLoadingState() {
	const [loadingState, dispatch] = useReducer(reducer, initialState);

	const setLoadingState = useCallback(
		(loadingType: keyof ILoadingState, value: boolean) => {
			dispatch({ type: SET_LOADING, payload: loadingType, value });
		},
		[],
	);

	return { loadingState, setLoadingState };
}
