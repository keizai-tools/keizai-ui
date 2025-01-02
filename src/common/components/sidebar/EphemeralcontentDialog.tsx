import { Fragment, useState } from 'react';

import EphemeralContent from '../Tabs/FunctionsTab/EphemeralContent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import StartOverlayLoading from '@/common/views/StartOverlayLoading';
import StopOverlayLoading from '@/common/views/StopOverlayLoading';

interface EphemeralContentDialogProps {
  open: boolean;
  onOpenChange: () => void;
  loading: boolean;
  error: string | null;
  status: {
    status: string;
    taskArn: string;
    isEphemeral: boolean;
  };
  setEphemeral: (status: boolean) => void;
  handleStart: ({ interval }: { interval: number }) => Promise<void>;
  handleStop: () => Promise<void>;
}

function EphemeralContentDialog({
  open,
  onOpenChange,
  loading,
  error,
  status,
  setEphemeral,
  handleStop,
  handleStart,
}: Readonly<EphemeralContentDialogProps>) {
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const startHandler = async ({ interval }: { interval: number }) => {
    setIsStarting(true);
    await handleStart({ interval });
    setIsStarting(false);
  };

  const stopHandler = async () => {
    setIsStopping(true);
    await handleStop();
    setIsStopping(false);
  };

  return (
    <Fragment>
      {loading ? (
        isStarting ? (
          <StartOverlayLoading />
        ) : isStopping ? (
          <StopOverlayLoading />
        ) : null
      ) : (
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
              error={error}
              status={status}
              loading={loading}
              handleStart={startHandler}
              handleStop={stopHandler}
              setEphemeral={setEphemeral}
            />
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}

export default EphemeralContentDialog;
