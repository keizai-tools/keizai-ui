import { PlusIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import EnvironmentEmptyState from '../Environments/EnvironmentEmptyState';
import EnvironmentItem from '../Environments/EnvironmentItem';
import { Button } from '../ui/button';

import {
  useDeleteEnvironmentMutation,
  useCreateAllEnvironmentsMutation,
} from '@/common/api/environments';
import { Collection } from '@/common/types/collection';
import { Environment } from '@/common/types/environment';

export const CollectionVariables = ({
  collection,
  collectionId,
  environments,
}: {
  collectionId: string;
  collection: Collection | undefined;
  environments: Environment[];
}) => {
  const { mutate: deleteEnvironmentMutation } = useDeleteEnvironmentMutation({
    collectionId,
  });
  const { mutate: createEnvironmentsMutation } =
    useCreateAllEnvironmentsMutation({
      collectionId,
    });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      environments: environments,
    },
  });

  const { fields, append, remove } = useFieldArray({
    keyName: 'key',
    control,
    name: 'environments',
  });

  const addNewInputVariable = () => {
    append({
      id: '',
      name: '',
      value: '',
    });
  };

  const handleRemoveEnvironment = (id: string) => {
    reset({
      environments: fields.filter((field) => field.id !== id),
    });
    deleteEnvironmentMutation(id);
    if (window.umami) window.umami.track('Delete collection variable');
  };

  const onSubmit = (data: { environments: Environment[] | undefined }) => {
    const environmentsToCreate = data.environments?.filter(
      (environment) => environment.id === '',
    );
    if (environmentsToCreate) {
      createEnvironmentsMutation(environmentsToCreate);
      if (window.umami)
        window.umami.track('Save collection variables', {
          amount: environmentsToCreate.length,
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t py-8 px-6 h-[400px] w-full"
      data-test="collection-variables-container"
    >
      <header className="flex justify-between mr-8">
        <div>
          <h1
            className="text-3xl font-semibold text-primary"
            data-test="collection-variables-title"
          >
            Collections variables
          </h1>
          <p
            className="px-2 text-sm font-semibold text-slate-400"
            data-test="collection-variables-collection-name"
          >
            {collection?.name}
          </p>
        </div>
        <div>
          <Button
            type="button"
            className="w-auto px-4 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            data-test="collection-variables-btn-add"
            onClick={addNewInputVariable}
          >
            <PlusIcon size={12} className="mr-2" />
            Add new
          </Button>
        </div>
      </header>
      {fields.length > 0 ? (
        <>
          <ul
            className="flex flex-col gap-2 px-1 pt-12"
            data-test="collection-variables-container"
          >
            {fields.map((environment, index) => (
              <EnvironmentItem
                key={index}
                environment={environment}
                index={index}
                collectionId={collectionId}
                control={control}
                watch={watch}
                errors={errors}
                removeItem={remove}
                deleteMutation={handleRemoveEnvironment}
              />
            ))}
          </ul>
          <div className="flex justify-end pt-4 mr-8">
            <Button
              type="submit"
              className="w-auto px-4 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-test="collection-variables-btn-save"
            >
              Save
            </Button>
          </div>
        </>
      ) : (
        <EnvironmentEmptyState
          styles="py-8 text-base"
          testName="collection-variables-empty-state"
        />
      )}
    </form>
  );
};
