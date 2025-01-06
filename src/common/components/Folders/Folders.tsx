import { ArrowLeftIcon, PlusIcon, ListVideo } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import NewEntityDialog from '../Entity/NewEntityDialog';
import InvocationListItem from '../Invocations/InvocationListItem';
import { Button } from '../ui/button';
import Folder from './Folder';

import {
  useFoldersByCollectionIdQuery,
  useCreateFolderMutation,
} from '@/common/api/folders';
import {
  useCreateInvocationMutation,
  useInvocationsByCollectionIdQuery,
} from '@/common/api/invocations';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/common/components/ui/tooltip';

function Folders() {
  const params = useParams();
  const { data: folders, isLoading: isLoadingFolders } =
    useFoldersByCollectionIdQuery({
      id: params.collectionId,
    });
  const { data: invocations, isLoading: isLoadingInvocations } =
    useInvocationsByCollectionIdQuery({
      id: params.collectionId,
    });

  const currentRoute = location.pathname;

  const { mutate: createFolder, isPending: isCreatingFolder } =
    useCreateFolderMutation();
  const { mutate: createInvocation, isPending: isCreatingInvocation } =
    useCreateInvocationMutation();
  const navigate = useNavigate();

  async function onCreateFolder({ name }: { name: string }) {
    if (params.collectionId) {
      createFolder({ name, collectionId: params.collectionId });
      if (window.umami) window?.umami?.track('Create folder');
    }
  }

  async function onCreateInvocation({ name }: { name: string }) {
    if (params.collectionId) {
      createInvocation({
        name,
        collectionId: params.collectionId,
      });
      if (window.umami) window?.umami?.track('Create invocation');
    }
  }

  function renderFoldersContent() {
    if (isLoadingFolders) {
      return (
        <span className="text-xs text-slate-400" data-test="collection-loading">
          Loading folders...
        </span>
      );
    }

    if (folders && folders.length > 0) {
      return (
        <div className="flex flex-col text-slate-400">
          {folders.map((folder) => (
            <Folder key={folder.id} folder={folder} />
          ))}
        </div>
      );
    }

    return (
      <span
        className="text-xs text-slate-400"
        data-test="collection-empty-folders"
      >
        Create your first folder here
      </span>
    );
  }

  function renderInvocationsContent() {
    if (isLoadingInvocations) {
      return (
        <span className="text-xs text-slate-400" data-test="collection-loading">
          Loading invocations...
        </span>
      );
    }

    if (invocations && invocations.length > 0) {
      return (
        <div className="flex flex-col text-slate-400">
          {invocations.map((invocation) => (
            <InvocationListItem key={invocation.id} invocation={invocation} />
          ))}
        </div>
      );
    }
  }

  return (
    <div
      className="min-w-[250px] flex flex-col justify-between border-r dark:border-r-border h-full px-3 py-1 gap-4"
      data-test="collections-container"
    >
      <div data-test="folders-container ">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="link"
            className="flex items-center gap-2 p-0 text-xs text-primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeftIcon size={16} /> Collections
          </Button>
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Link
                data-test="invocations-by-collection-btn-link"
                className={`flex h-auto gap-1 px-0 py-1 text-xs ${
                  currentRoute.includes(
                    `/collection/${params.collectionId}/invocations`,
                  )
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-slate-100'
                }`}
                to={`/collection/${params.collectionId}/invocations`}
              >
                <ListVideo size={16} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Collection runner</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <div
            className="flex items-center justify-between mt-3"
            data-test="collections-header"
          >
            <h4
              className="text-lg font-bold"
              data-test="collections-header-title"
            >
              Folders
            </h4>
            <NewEntityDialog
              title="New folder"
              description="Let's name your folder"
              defaultName="Folder"
              isLoading={isCreatingFolder}
              onSubmit={onCreateFolder}
              elementList={folders}
            >
              <Button
                variant="link"
                className="flex h-auto gap-1 px-0 py-1 text-xs text-slate-500 hover:text-slate-100"
                data-test="collections-header-btn-new"
              >
                <PlusIcon size={12} /> Add
              </Button>
            </NewEntityDialog>
          </div>
          {renderFoldersContent()}
        </div>
        <div className="mt-5 ">
          <div
            className="flex items-center justify-between mb-3"
            data-test="collections-invocations-header"
          >
            <h4
              className="text-lg font-bold"
              data-test="collections-invocations-header-title"
            >
              Invocations
            </h4>
            <NewEntityDialog
              title="New invocation"
              description="Let's name your invocation"
              defaultName="Invocation"
              isLoading={isCreatingInvocation}
              onSubmit={onCreateInvocation}
              elementList={invocations}
            >
              <Button
                variant="link"
                className="flex h-auto gap-1 px-0 py-1 text-xs text-slate-500 hover:text-slate-100"
                data-test="collections-header-btn-new-invocation"
              >
                <PlusIcon size={12} /> Add
              </Button>
            </NewEntityDialog>
          </div>
          {renderInvocationsContent()}
        </div>
      </div>
      <div className="w-full mb-4 text-base font-semibold text-center hover:underline">
        <Link
          className="text-primary"
          data-test="collections-variables-btn-link"
          to={`/collection/${params.collectionId}/variables`}
        >
          Collection variables
        </Link>
      </div>
    </div>
  );
}

export default Folders;
