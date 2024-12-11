import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Input } from '../../ui/input';

import useStellar from '@/common/hooks/useStellar';

enum SECRET_KEY_ERROR {
  REQUIRED = 'Secret key is required',
  INVALID_SECRET_KEY = 'Please enter a valid Private key',
}

function ImportAccount({
  invocationId,
  editKeys,
}: Readonly<{
  invocationId: string;
  editKeys: UseMutateFunction<
    unknown,
    Error,
    {
      id: string;
      secretKey?: string;
      publicKey?: string;
    },
    unknown
  >;
}>) {
  const [isError, setIsError] = React.useState(false);
  const { connectAccount } = useStellar();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      secretKey: '',
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: connectAccount,
    onSuccess: (data) => {
      editKeys({ id: invocationId, ...data });
    },
  });
  const submitAndReset = async ({ secretKey }: { secretKey: string }) => {
    mutate(secretKey);
    reset({
      secretKey: '',
    });
    if (window.umami) window.umami.track('Import account');
    setIsError(false);
  };

  return (
    <Dialog open={isError} onOpenChange={setIsError}>
      <DialogTrigger asChild>
        <Button
          className="font-bold px-10 border-[3px] border-primary text-primary h-full hover:text-background hover:bg-primary"
          variant="outline"
          data-test="auth-stellar-import-account-btn"
          onClick={() =>
            reset({
              secretKey: '',
            })
          }
        >
          Import account
        </Button>
      </DialogTrigger>
      <DialogContent data-test="import-account-modal-container">
        <DialogHeader>
          <DialogTitle data-test="import-account-modal-title">
            Connect with a secret key
          </DialogTitle>
          <DialogDescription data-test="import-account-modal-description">
            Please enter your secret key to authenticate
          </DialogDescription>
        </DialogHeader>
        <form
          id="import-account"
          className="flex mt-4 space-x-2"
          data-test="import-account-modal-form-container"
          onSubmit={handleSubmit(submitAndReset)}
        >
          <div className="grid flex-1 gap-2">
            <Controller
              control={control}
              name="secretKey"
              rules={{ required: true, pattern: /^S[0-9A-Z]{55}$/ }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  data-test="import-account-modal-input"
                />
              )}
            />
            {errors.secretKey && (
              <p
                className="ml-4 text-sm text-red-500"
                data-test="import-account-modal-error"
              >
                {errors.secretKey.type === 'required'
                  ? SECRET_KEY_ERROR.REQUIRED
                  : SECRET_KEY_ERROR.INVALID_SECRET_KEY}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            form="import-account"
            data-test="import-account-modal-btn-submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ImportAccount;
