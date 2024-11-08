import { AxiosRequestConfig } from 'axios';

import { IUserMeResponse } from './IUserMeResponse';

export interface IUserService {
  UserMe: (config?: AxiosRequestConfig) => Promise<IUserMeResponse>;
}
