import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import NewEntityDialog from '../Entity/NewEntityDialog';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

import { useCreateInvocationMutation } from '@/common/api/invocations';

const NewInvocationButton = ({
  folderId,
  collectionId,
}: {
  folderId?: string;
  collectionId?: string;
}) => {
  const { mutate, isPending } = useCreateInvocationMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <NewEntityDialog
      defaultName="Invocation"
      title="New invocation"
      description="Let's name your invocation"
      isLoading={isPending}
      onSubmit={({ name }) => {
        mutate(
          {
            name,
            folderId: folderId,
            collectionId: collectionId,
          },
          {
            onSuccess: (invocation) => {
              navigate(`invocation/${invocation.id}`);
            },
            onError: (error: {
              response?: { data?: { message?: string } };
              message?: string;
            }) => {
              const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'An error occurred';
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
            },
          },
        );
        if (window.umami) window.umami.track('Create invocation');
      }}
    >
      <Button
        variant="link"
        className="flex gap-2 p-0 text-xs text-slate-500 hover:text-slate-100"
        data-test="new-invocation-btn-container"
      >
        <PlusIcon size={12} /> Add invocation
      </Button>
    </NewEntityDialog>
  );
};

export default NewInvocationButton;
