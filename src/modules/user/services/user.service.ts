import { AxiosRequestConfig } from 'axios';

import { IUserMeResponse } from '../interfaces/IUserMeResponse';
import { IUserService } from '../interfaces/IUserService';

import { IApiService } from '@/config/axios/interfaces/IApiService';
import { apiService } from '@/config/axios/services/api.service';

class UserService implements IUserService {
  api: IApiService<AxiosRequestConfig>;
  constructor(api: IApiService<AxiosRequestConfig>) {
    this.api = api;
  }

  async UserMe(config?: AxiosRequestConfig) {
    return await this.api.get<IUserMeResponse>('/user/me', config);
  }

  async getFargateTime(config?: AxiosRequestConfig) {
    return await this.api.get<{
      success: boolean;
      statusCode: number;
      message: string;
      payload: { fargateTime: number };
      timestamp: string;
      path: string;
    }>('/user/fargate-time', config);
  }

  async updateUserBalance(
    userId: string,
    interval: number,
    config?: AxiosRequestConfig,
  ) {
    return await this.api.post(
      '/user/update-balance/' + userId,
      { interval },
      config,
    );
  }
}

export const userService = new UserService(apiService);
