import { Controller, useForm } from 'react-hook-form';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

function EditEntityDialog({
  open,
  onOpenChange,
  defaultName,
  title,
  description,
  onEdit,
  isLoading,
}: Readonly<{
  open: boolean;
  onOpenChange: () => void;
  id: string;
  defaultName: string;
  title: string;
  description: string;
  onEdit: ({ name }: { name: string }) => void;
  isLoading: boolean;
}>) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: defaultName,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-test="edit-entity-dialog-container"
        className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose"
      >
        <DialogHeader>
          <DialogTitle data-test="edit-entity-dialog-title">
            {title}
          </DialogTitle>
          <DialogDescription data-test="edit-entity-dialog-description">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex items-start gap-3 mt-4 space-x-2"
          data-test="edit-entity-dialog-form-container"
          onSubmit={handleSubmit(onEdit)}
        >
          <div className="grid flex-1 gap-2">
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Name is required', minLength: 1 }}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <Input {...field} />
                  {error && <p className="text-red-500">{error.message}</p>}
                </div>
              )}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            data-test="edit-entity-dialog-btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditEntityDialog;
