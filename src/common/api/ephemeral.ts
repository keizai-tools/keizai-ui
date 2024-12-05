import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { apiService } from '@/config/axios/services/api.service';

export function useEphemeralStatusMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      return await apiService
        ?.get<
          IApiResponse<{
            status: string;
            taskArn: string;
            publicIp: string;
          }>
        >('/ephemeral-environment/status')
        .then((res) => {
          return res.payload;
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            return { status: 'STOPPED', taskArn: '', publicIp: '' };
          }
          throw error;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ephemeral-environment', 'status'],
      });
    },
  });
  return mutation;
}

export function useEphemeralStartMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ interval }: { interval: number }) => {
      return await apiService
        ?.post<IApiResponse<{ taskArn: string; publicIp: string }>>(
          '/ephemeral-environment/start?interval=' + interval,
          {},
        )
        .then((response) => {
          return response.payload;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ephemeral-environment'] });
    },
  });
  return mutation;
}

export function useEphemeralStopMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      return await apiService
        ?.delete<IApiResponse<{ taskArn: string }>>(
          '/ephemeral-environment/stop',
        )
        .then((response) => response.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ephemeral-environment'] });
    },
  });
  return mutation;
}
