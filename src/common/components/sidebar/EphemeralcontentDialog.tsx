import { Fragment } from 'react';

import EphemeralContent from '../Tabs/FunctionsTab/EphemeralContent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import { useEphemeralProvider } from '@/common/context/useEphemeralContext';

interface EphemeralContentDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

function EphemeralContentDialog({
  open,
  onOpenChange,
}: Readonly<EphemeralContentDialogProps>) {
  const {
    loading,
    status,
    handleStart,
    handleStop,
    isError,
    isLoading: isEphemeralLoading,
    countdown,
    setEphemeral,
  } = useEphemeralProvider();

  const startHandler = async ({ interval }: { interval: number }) => {
    await handleStart({ interval });
  };

  const stopHandler = async () => {
    await handleStop();
  };

  return (
    <Fragment>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          data-test="import-account-modal-container"
          className="min-w-fit"
        >
          <DialogHeader>
            <DialogTitle
              data-test="import-account-modal-title"
              className="text-lg select-none"
            >
              {'Ephemeral Network'}
            </DialogTitle>
            <DialogDescription
              data-test="import-account-modal-description"
              className="text-sm select-none"
            >
              {
                'You are using an ephemeral network. Ensure that your transactions can be completed without persistent state.'
              }
            </DialogDescription>
          </DialogHeader>

          <EphemeralContent
            error={isError ? 'Failed to fetch ephemeral status' : ''}
            status={status}
            loading={loading || isEphemeralLoading}
            handleStart={startHandler}
            handleStop={stopHandler}
            setEphemeral={setEphemeral}
            {...countdown}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default EphemeralContentDialog;
