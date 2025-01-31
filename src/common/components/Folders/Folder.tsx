import { GanttChart } from 'lucide-react';
import React, { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DeleteEntityDialog from '../Entity/DeleteEntityDialog';
import EditEntityDialog from '../Entity/EditEntityDialog';
import MoreOptions from '../Entity/MoreOptions';
import InvocationListItem from '../Invocations/InvocationListItem';
import NewInvocationButton from '../Invocations/NewInvocationButton';

import {
  useDeleteFolderMutation,
  useEditFolderMutation,
} from '@/common/api/folders';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/common/components/ui/accordion';
import { useEphemeralProvider } from '@/common/context/useEphemeralContext';
import { Folder as IFolder } from '@/common/types/folder';
import NETWORKS from '@/modules/signer/constants/networks';

function Folder({
  folder,
  elementList,
}: Readonly<{
  folder: IFolder;
  elementList?: {
    name: string;
  }[];
}>) {
  const params = useParams();
  const [isOpen, setIsOpen] = React.useState<string[] | undefined>();
  const [openDialog, setOpenDialog] = React.useState<'edit' | 'delete' | null>(
    null,
  );

  const navegate = useNavigate();
  const { mutate: deleteFolderMutation } = useDeleteFolderMutation({
    collectionId: params?.collectionId,
  });
  const { status } = useEphemeralProvider();
  const { mutate: editFolderMutation, isPending: isEditingFolder } =
    useEditFolderMutation({ collectionId: params?.collectionId });

  React.useLayoutEffect(() => {
    if (params?.invocationId && folder) {
      const folderHasInvocation = folder.invocations?.find(
        (invocation) => invocation.id === params?.invocationId,
      );

      if (folderHasInvocation) {
        setIsOpen([folder.id]);
      }
    }
  }, [folder, params?.invocationId]);

  function handleDeleteFolder() {
    deleteFolderMutation(folder.id);
    if (window.umami) window.umami.track('Delete folder');
    setOpenDialog(null);
    if (params?.invocationId && folder) {
      const folderHasInvocation = folder.invocations?.find(
        (invocation) => invocation.id === params?.invocationId,
      );

      if (folderHasInvocation) {
        navegate(`/collection/${params?.collectionId}`);
      }
    }
  }

  return (
    <Fragment>
      <Accordion
        type="multiple"
        className="w-full"
        value={isOpen}
        onValueChange={() => {
          if (isOpen?.includes(folder.id)) {
            setIsOpen(isOpen?.filter((id) => id !== folder.id));
          } else {
            setIsOpen(isOpen ? [...isOpen, folder.id] : [folder.id]);
          }
        }}
      >
        <AccordionItem value={folder.id} className="border-none">
          <AccordionTrigger
            className="w-full h-10 "
            data-test="collection-folder-container"
          >
            <div className="flex items-center justify-between w-full text-sm text-slate-100">
              <div
                className="flex items-center gap-1"
                data-test="folder-accordion-title"
              >
                <GanttChart size={16} />
                <span data-test="collection-folder-name">{folder.name}</span>
              </div>
              <div>
                <MoreOptions
                  onClickDelete={(e) => {
                    e.stopPropagation();
                    setOpenDialog('delete');
                  }}
                  onClickEdit={(e) => {
                    e.stopPropagation();
                    setOpenDialog('edit');
                  }}
                />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="flex flex-col justify-start text-slate-100"
              data-test="collection-folder-invocation-list"
            >
              {folder.invocations
                .filter(
                  (invocation) =>
                    !(
                      invocation.network === NETWORKS.EPHEMERAL &&
                      status.status === 'STOPPED'
                    ),
                )
                .map((invocation) => (
                  <InvocationListItem
                    key={invocation.id}
                    invocation={invocation}
                  />
                ))}

              <div
                className="ml-4"
                data-test="collection-folder-new-invocation-btn"
              >
                <NewInvocationButton
                  elementList={folder.invocations}
                  folderId={folder.id}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <DeleteEntityDialog
        title="Are you sure?"
        description="This will permanently delete your folder and all related invocations."
        open={openDialog === 'delete'}
        onOpenChange={() => setOpenDialog(null)}
        onConfirm={handleDeleteFolder}
      />
      <EditEntityDialog
        id={folder.id}
        elementList={elementList}
        defaultName={folder.name}
        open={openDialog === 'edit'}
        onOpenChange={() => setOpenDialog(null)}
        title="Edit folder"
        description="Let's name your folder"
        onEdit={({ name }) => {
          editFolderMutation({ id: folder.id, name: name });
          if (window.umami) window.umami.track('Edit folder');
          setOpenDialog(null);
        }}
        isLoading={isEditingFolder}
      />
    </Fragment>
  );
}

export default Folder;
