export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  payload: T;
  timestamp: string;
  path: string;
}
