import { useCallback, useReducer } from 'react';

import {
	SET_STATUS,
	Action,
	IStatusState,
	type IStatus,
} from '../interfaces/IStatusState';

const initial = {
	status: false,
	error: null,
	loading: false,
};

const initialState: IStatusState = {
	signIn: initial,
	signUp: initial,
	forgotPassword: initial,
	resendConfirmationCode: initial,
	confirmUser: initial,
	confirmPassword: initial,
	refreshSession: initial,
	signOut: initial,
	resetPassword: initial,
	wallet: initial,
	changePassword: initial,
};

function reducer(state: IStatusState, action: Action): IStatusState {
	switch (action.type) {
		case SET_STATUS:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					...action.value,
				},
			};
		default:
			return state;
	}
}

export function useStatusState() {
	const [statusState, dispatch] = useReducer(reducer, initialState);

	const setStatusState = useCallback(
		(statusType: keyof IStatusState, value: Partial<IStatus>) => {
			dispatch({
				type: SET_STATUS,
				payload: statusType,
				value,
			});
		},
		[],
	);

	return { statusState, setStatusState };
}
