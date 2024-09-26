import { IApiResponseError } from '../interfaces/IApiResponseError';

export class ApiResponseError extends Error implements IApiResponseError {
  success: boolean;
  statusCode: number;
  error: string;
  message: string;
  details: {
    description: string | string[];
    possibleCauses: string[];
    suggestedFixes: string[];
  };
  timestamp: string;
  path: string;

  constructor({
    success,
    statusCode,
    error,
    message,
    details,
    timestamp,
    path,
  }: IApiResponseError) {
    super(message);
    this.success = success;
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
    this.details = details;
    this.timestamp = timestamp;
    this.path = path;
  }
}

export type ApiError = {
  message: string;
  status: number;
};
export function isApiError(error: unknown): error is ApiError {
  return !!(error as ApiError).message;
}
