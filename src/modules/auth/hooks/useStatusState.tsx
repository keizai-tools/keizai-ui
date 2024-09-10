import { useCallback, useReducer } from 'react';

import {
  SET_STATUS,
  Action,
  IStatusState,
  IStatus,
} from '../interfaces/IStatusState';

const initial = {
  status: false,
  error: null,
  loading: false,
  data: null,
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
  const statusType = action.payload;
  const updatedStatus = {
    ...state[statusType],
    ...action.value,
  };

  return {
    ...state,
    [statusType]: updatedStatus,
  };
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
