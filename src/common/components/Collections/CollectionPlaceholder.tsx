import { ListPlusIcon } from 'lucide-react';

import NewEntityDialog from '../Entity/NewEntityDialog';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

import { useNewCollectionMutation } from '@/common/api/collections';
import type { Collection } from '@/common/types/collection';

function CollectionPlaceholder({ elementList }: { elementList: Collection[] }) {
  const { mutate, isPending } = useNewCollectionMutation();
  const { toast } = useToast();

  return (
    <NewEntityDialog
      title="New collection"
      description="Let's name your collection"
      defaultName="Collection"
      elementList={elementList}
      isLoading={isPending}
      onSubmit={async ({ name }) => {
        mutate(
          { name },
          {
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
        if (window.umami) window.umami.track('Create collection');
      }}
    >
      <Button
        variant="ghost"
        className="flex flex-col gap-4 border-dashed border-2 border-primary rounded-lg h-[200px] w-[300px] font-bold"
        data-test="collections-header-btn-new"
      >
        <ListPlusIcon size={42} />
        Create a new collection
      </Button>
    </NewEntityDialog>
  );
}

export default CollectionPlaceholder;
