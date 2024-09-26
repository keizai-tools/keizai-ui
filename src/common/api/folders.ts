import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Folder } from '../types/folder';

import type { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { apiService } from '@/config/axios/services/api.service';

export function useFoldersQuery() {
  const query = useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: async () =>
      apiService?.get<IApiResponse<Folder[]>>('/folder').then((res) => {
        return res.payload;
      }),
  });

  return query;
}

export function useFolderQuery({ id }: { id?: string }) {
  const query = useQuery<Folder>({
    queryKey: ['folder', id],
    queryFn: async () =>
      apiService?.get<IApiResponse<Folder>>(`/folder/${id}`).then((res) => {
        return res.payload;
      }),
    enabled: !!id,
  });

  return query;
}

export function useFoldersByCollectionIdQuery({ id }: { id?: string }) {
  const query = useQuery<Folder[]>({
    queryKey: ['collection', id, 'folders'],
    queryFn: async () =>
      apiService
        ?.get<IApiResponse<Folder[]>>(`/collection/${id}/folders`)
        .then((res) => res.payload),
    enabled: !!id,
  });

  return query;
}

export function useCreateFolderMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      name,
      collectionId,
    }: {
      name: string;
      collectionId: string;
    }) =>
      apiService
        ?.post<IApiResponse<Folder>>('/folder', { name, collectionId })
        .then((res) => res.payload),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['collection', collectionId, 'folders'],
      });
    },
  });

  return mutation;
}

export function useDeleteFolderMutation({
  collectionId,
}: {
  collectionId?: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) =>
      apiService?.delete<IApiResponse<boolean>>(`/folder/${id}`).then((res) => {
        return res.payload;
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ['collection', collectionId, 'folders'],
      });

      const previousFolders = queryClient.getQueryData<Folder[]>([
        'collection',
        collectionId,
        'folders',
      ]);

      queryClient.setQueryData(
        ['collection', collectionId, 'folders'],
        previousFolders?.filter((folder) => folder.id !== id),
      );

      return {
        previousFolders,
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['collection', collectionId, 'folders'],
      });
    },
  });

  return mutation;
}

export function useEditFolderMutation({
  collectionId,
}: {
  collectionId?: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      apiService
        ?.patch<IApiResponse<Folder>>('/folder', { id, name })
        .then((res) => res.payload),
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({
        queryKey: ['collection', collectionId, 'folders'],
      });

      const previousFolders = queryClient.getQueryData<Folder[]>([
        'collection',
        collectionId,
        'folders',
      ]);

      queryClient.setQueryData(
        ['collection', collectionId, 'folders'],
        previousFolders?.map((folder) =>
          folder.id === id ? { ...folder, name } : folder,
        ),
      );

      return {
        previousFolders,
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['collection', collectionId, 'folders'],
      });
    },
  });

  return mutation;
}
