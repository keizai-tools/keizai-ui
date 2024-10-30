import { Fragment, useEffect, useState } from 'react';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import QRModal from './QRModal';
import BalanceComponent from './balanceComponent';
import { NetworkSection } from './networkSection';
import StellarBalance from './stellarBalance';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/common/components/ui/accordion';
import { NETWORK } from '@/common/types/soroban.enum';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { StoredCookies } from '@/modules/cookies/interfaces/cookies.enum';
import { cookieService } from '@/modules/cookies/services/cookie.service';

export default function ConnectWalletDialog({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const { connectWallet, wallet, onCreateAccount, disconnectWallet } =
    useAuthProvider();

  const [showWarning, setShowWarning] = useState(false);
  const [confirmCreateAccount, setConfirmCreateAccount] = useState(false);
  const [showDisconnectWarning, setShowDisconnectWarning] = useState(false);
  const [replaceAutoGenerate, setReplaceAutoGenerate] = useState(false);
  const memoId: string = cookieService.getCookie(StoredCookies.MEMO_ID) ?? '';
  const [openNetworks, setOpenNetworks] = useState<string[]>([]);

  const atLeastOneConnected: boolean =
    !!wallet.MAINNET?.publicKey ||
    (wallet.TESTNET?.publicKey && !wallet.TESTNET.autoGenerated) ||
    (wallet.FUTURENET?.publicKey && !wallet.FUTURENET.autoGenerated) ||
    false;

  function handleCreateAccount() {
    if (
      (wallet.TESTNET?.publicKey && !wallet.TESTNET.autoGenerated) ||
      (wallet.FUTURENET?.publicKey && !wallet.FUTURENET.autoGenerated)
    ) {
      setShowWarning(true);
    } else {
      onCreateAccount();
    }
  }

  function handleReplaceAllWallets() {
    setShowWarning(false);
    setConfirmCreateAccount(true);
  }

  function handleReplaceAutogeneratedWallets() {
    setReplaceAutoGenerate(true);
    setShowWarning(false);
    setConfirmCreateAccount(true);
  }

  function handleCancelCreateAccount() {
    setShowWarning(false);
  }

  function handleDisconnectAll() {
    setShowDisconnectWarning(true);
  }

  function handleConfirmDisconnectAll() {
    setShowDisconnectWarning(false);
    disconnectWallet();
    onCreateAccount(false);
  }

  function handleCancelDisconnectAll() {
    setShowDisconnectWarning(false);
  }

  useEffect(() => {
    if (replaceAutoGenerate && confirmCreateAccount) {
      onCreateAccount(false, true);
      setReplaceAutoGenerate(false);
      setConfirmCreateAccount(false);
    } else if (confirmCreateAccount) {
      onCreateAccount();
      setConfirmCreateAccount(false);
    }
  }, [confirmCreateAccount, onCreateAccount, replaceAutoGenerate, wallet]);

  function toggleNetwork(network: string) {
    setOpenNetworks((prev) =>
      prev.includes(network)
        ? prev.filter((n) => n !== network)
        : [...prev, network],
    );
  }

  return (
    <Fragment>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          data-test="dialog-edit-contract-address-container"
          className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose"
        >
          <DialogHeader>
            {wallet.MAINNET?.publicKey && (
              <div className="flex flex-row items-center justify-between gap-4">
                <BalanceComponent />
                <QRModal wallet={wallet} stellarMemo={memoId} />
              </div>
            )}
          </DialogHeader>
          <Accordion type="multiple">
            <AccordionItem value="mainnet">
              <AccordionTrigger onClick={() => toggleNetwork('mainnet')}>
                Mainnet Network Status
              </AccordionTrigger>
              {openNetworks.includes('mainnet') && (
                <AccordionContent>
                  <StellarBalance
                    title="Mainnet"
                    publicKey={wallet?.MAINNET?.publicKey}
                    network="mainnet"
                  />
                  <NetworkSection
                    network={NETWORK.SOROBAN_MAINNET}
                    wallet={wallet.MAINNET}
                    connectWallet={connectWallet}
                    disconnectWallet={disconnectWallet}
                  />
                </AccordionContent>
              )}
            </AccordionItem>

            <AccordionItem value="testnet">
              <AccordionTrigger onClick={() => toggleNetwork('testnet')}>
                Testnet Network Status
              </AccordionTrigger>
              {openNetworks.includes('testnet') && (
                <AccordionContent>
                  <StellarBalance
                    title="Testnet"
                    publicKey={wallet?.TESTNET?.publicKey}
                    network="testnet"
                  />
                  <NetworkSection
                    network={NETWORK.SOROBAN_TESTNET}
                    wallet={wallet.TESTNET}
                    connectWallet={connectWallet}
                    disconnectWallet={disconnectWallet}
                  />
                </AccordionContent>
              )}
            </AccordionItem>

            {wallet.FUTURENET?.publicKey && (
              <AccordionItem value="futurenet">
                <AccordionTrigger onClick={() => toggleNetwork('futurenet')}>
                  Futurenet Network Status
                </AccordionTrigger>
                {openNetworks.includes('futurenet') && (
                  <AccordionContent>
                    <StellarBalance
                      title="Futurenet"
                      publicKey={wallet.FUTURENET?.publicKey}
                      network="futurenet"
                    />
                    <NetworkSection
                      network={NETWORK.SOROBAN_FUTURENET}
                      wallet={wallet.FUTURENET}
                      connectWallet={connectWallet}
                      disconnectWallet={disconnectWallet}
                    />
                  </AccordionContent>
                )}
              </AccordionItem>
            )}
          </Accordion>
          <Button
            onClick={handleCreateAccount}
            className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            variant="outline"
            data-test="auth-stellar-create-account-btn"
          >
            Generate new account
          </Button>
          {atLeastOneConnected && (
            <Button
              onClick={handleDisconnectAll}
              className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              variant="outline"
              data-test="auth-stellar-disconnect-btn"
            >
              Disconnect all wallets
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold select-none">
              Warning
            </DialogTitle>
          </DialogHeader>
          <p>
            You are about to make changes to your wallets. You have the option
            to replace all wallets or just the autogenerated ones. Please choose
            an option below:
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleReplaceAllWallets}
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              variant="outline"
            >
              Replace All Wallets
            </Button>
            <Button
              onClick={handleReplaceAutogeneratedWallets}
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              variant="outline"
            >
              Replace Autogenerated Wallets Only
            </Button>
            <Button
              onClick={handleCancelCreateAccount}
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDisconnectWarning}
        onOpenChange={setShowDisconnectWarning}
      >
        <DialogContent className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold select-none">
              Warning
            </DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to disconnect all wallets?</p>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleConfirmDisconnectAll}
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              variant="outline"
            >
              Yes, Disconnect
            </Button>
            <Button
              onClick={handleCancelDisconnectAll}
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
