export type ErrorValue = string[] | string | null;

export interface IStatus {
  status: boolean;
  error: ErrorValue;
  loading: boolean;
  data: string | null;
}

export interface IStatusState {
  signIn: IStatus;
  signUp: IStatus;
  forgotPassword: IStatus;
  resendConfirmationCode: IStatus;
  confirmUser: IStatus;
  confirmPassword: IStatus;
  refreshSession: IStatus;
  signOut: IStatus;
  resetPassword: IStatus;
  wallet: IStatus;
  changePassword: IStatus;
}

export type ActionType = 'SET_STATUS';
export const SET_STATUS = 'SET_STATUS';

export interface Action {
  type: ActionType;
  payload: keyof IStatusState;
  value: Partial<IStatus>;
}
