import { FileText } from 'lucide-react';
import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import DeleteEntityDialog from '../Entity/DeleteEntityDialog';
import EditEntityDialog from '../Entity/EditEntityDialog';
import MoreOptions from '../Entity/MoreOptions';
import { Button } from '../ui/button';

import {
  useDeleteInvocationMutation,
  useEditInvocationMutation,
} from '@/common/api/invocations';
import { Invocation } from '@/common/types/invocation';

const InvocationListItem = ({ invocation }: { invocation: Invocation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState<'edit' | 'delete' | null>(
    null,
  );
  const { mutate: deleteInvocationMutation } = useDeleteInvocationMutation();
  const { mutate: editInvocationMutation, isPending: isEditingInvocation } =
    useEditInvocationMutation();

  return (
    <>
      <div
        className="flex items-center justify-between w-full text-sm text-slate-100 group"
        data-test="invocation-item"
      >
        <Button
          variant="link"
          className="flex justify-start w-full text-slate-100"
          asChild
        >
          <NavLink to={`invocation/${invocation?.id}`}>
            <div
              data-test="invocation-list-container"
              className={`flex gap-1 items-center ${
                params?.invocationId &&
                params?.invocationId === invocation.id &&
                'text-primary'
              }`}
            >
              <FileText size={16} />
              <span data-test="collection-folder-name">{invocation.name}</span>
            </div>
          </NavLink>
        </Button>
        <div className="invisible group-hover:visible">
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
      <DeleteEntityDialog
        title="Are you sure?"
        description="This will permanently delete your invocation."
        open={openDialog === 'delete'}
        onOpenChange={() => setOpenDialog(null)}
        onConfirm={() => {
          deleteInvocationMutation(invocation.id);
          if (window.umami) window.umami.track('Delete invocation');
          if (params?.invocationId === invocation.id) {
            navigate('/collection/' + params.collectionId);
          }
          setOpenDialog(null);
        }}
      />
      <EditEntityDialog
        id={invocation.id}
        defaultName={invocation.name}
        open={openDialog === 'edit'}
        onOpenChange={() => setOpenDialog(null)}
        title="Edit invocation"
        description="Let's name your invocation"
        onEdit={({ name }) => {
          editInvocationMutation({
            id: invocation.id,
            name: name,
          });
          if (window.umami) window.umami.track('Edit invocation');
          setOpenDialog(null);
        }}
        isLoading={isEditingInvocation}
      />
    </>
  );
};

export default InvocationListItem;
