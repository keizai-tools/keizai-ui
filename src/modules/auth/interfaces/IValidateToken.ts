export interface IValidateToken {
  success: boolean;
  path: string;
  payload: {
    success: boolean;
  };
  statusCode: number;
  timestamp: string;
}
