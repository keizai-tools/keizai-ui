export interface IUserMeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  payload: {
    email: string;
    externalId: string;
    memoId: string;
    balance: number;
    roles: string[];
    id: number;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
  path: string;
}
