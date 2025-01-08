import { useMutation } from '@tanstack/react-query';

import { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { apiService } from '@/config/axios/services/api.service';

export function useEphemeralStatusMutation() {
  const mutation = useMutation({
    mutationFn: async () => {
      return await apiService
        ?.get<
          IApiResponse<{
            status: string;
            taskArn: string;
            publicIp: string;
            taskStartedAt: string;
            taskStoppedAt: string;
            executionInterval: number;
          }>
        >('/ephemeral-environment/status')
        .then((res) => {
          return res.payload;
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            return {
              status: 'STOPPED',
              taskArn: '',
              publicIp: '',
              taskStartedAt: '',
              taskStoppedAt: '',
              executionInterval: 0,
            };
          }
          throw error;
        });
    },
  });
  return mutation;
}

export function useEphemeralStartMutation() {
  const mutation = useMutation({
    mutationFn: async ({ interval }: { interval: number }) => {
      return await apiService
        ?.post<
          IApiResponse<{
            status: string;
            taskArn: string;
            publicIp: string;
            taskStartedAt: string;
            taskStoppedAt: string;
            executionInterval: number;
          }>
        >('/ephemeral-environment/start?interval=' + interval, {})
        .then((response) => {
          return response.payload;
        });
    },
  });
  return mutation;
}

export function useEphemeralStopMutation() {
  const mutation = useMutation({
    mutationFn: async () => {
      return await apiService
        ?.delete<IApiResponse<{ taskArn: string }>>(
          '/ephemeral-environment/stop',
        )
        .then((response) => response.payload);
    },
  });
  return mutation;
}

export function useEphemeralFriendBotMutation() {
  const mutation = useMutation({
    mutationFn: async ({ publicKey }: { publicKey: string }) => {
      return await apiService
        ?.get<IApiResponse<unknown>>(
          `/ephemeral-environment/friendbot?addr=${publicKey}`,
        )
        .then((response) => {
          return response.payload;
        });
    },
  });
  return mutation;
}
