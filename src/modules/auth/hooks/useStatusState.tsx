import { useCallback, useReducer } from 'react';

import { SET_STATUS, Action, IStatusState } from '../interfaces/IStatusState';

const initialState: IStatusState = {
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

function reducer(state: IStatusState, action: Action): IStatusState {
	const actionHandlers = {
		[SET_STATUS]: () => ({ ...initialState, [action.payload]: action.value }),
	};

	const actionHandler = actionHandlers[action.type] || (() => state);
	return actionHandler();
}

export function useStatusState() {
	const [statusState, dispatch] = useReducer(reducer, initialState);

	const setStatusState = useCallback(
		(statusType: keyof IStatusState, value: boolean) => {
			dispatch({ type: SET_STATUS, payload: statusType, value });
		},
		[],
	);

	return { statusState, setStatusState };
}
