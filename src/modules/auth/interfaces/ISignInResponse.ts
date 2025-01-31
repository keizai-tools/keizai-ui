export interface ISignInResponse {
  success: boolean;
  statusCode: number;
  message: string;
  payload: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    user: {
      email: string;
      externalId: string;
      memoId: string;
      balance: number;
      roles: string[];
      id: number;
      createdAt: string;
      updatedAt: string;
    };
  };
  timestamp: string;
  path: string;
}
