import { Copy } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useState, Fragment } from 'react';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useToast } from '../ui/use-toast';

import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';

export default function QRModal({
  wallet,
  stellarMemo,
}: Readonly<{ wallet: IWallet; stellarMemo: string }>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const publicKeyTest = import.meta.env.VITE_PUBLIC_KEY_TEST;

  function copyMemo() {
    const memoToCopy = `${stellarMemo}`;
    navigator.clipboard.writeText(memoToCopy);
    toast({
      title: 'Copied!',
      description: 'Memo has been copied to your clipboard.',
    });
  }

  function copyWalletAddress() {
    const addressToCopy = `${publicKeyTest}`;
    navigator.clipboard.writeText(addressToCopy);
    toast({
      title: 'Copied!',
      description: 'Wallet Address has been copied to your clipboard.',
    });
  }

  return (
    <Fragment>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className="w-40 h-8 py-1 mx-4 text-sm font-bold transition-all duration-300 ease-in-out transform border-2 whitespace-nowrap hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Recharge Wallet
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex flex-col w-auto h-auto gap-6 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center text-red-500 select-none">
              Both MEMO ID and address are required or you will lose your coins.
            </DialogTitle>
            <DialogTitle className="text-xl font-semibold text-center text-red-500 select-none">
              Only payments in USDC are accepted. Other assets will not be
              processed.
            </DialogTitle>
          </DialogHeader>

          {wallet.MAINNET?.publicKey && (
            <div className="flex flex-col items-start justify-between w-auto h-full gap-4 p-6 font-bold border-2 border-solid rounded-lg border-offset-background bg-slate-900 ">
              <div className="flex items-center w-full gap-4 p-4 border-2 border-solid rounded-lg bg-slate-950 border-offset-background">
                <QRCodeCanvas value={publicKeyTest} size={100} level="H" />
                <p className="h-full text-center pointer-events-none whitespace-nowrap w-min text-slate-600">
                  Wallet Address
                </p>
                <p className="w-full h-full overflow-hidden font-light text-center whitespace-nowrap">
                  {publicKeyTest}
                </p>
                <Copy
                  className="h-full transition-all duration-300 ease-in-out transform cursor-pointer hover:text-primary hover:scale-110"
                  onClick={copyWalletAddress}
                />
              </div>
              <div className="flex items-center w-full gap-4 p-4 border-2 border-solid rounded-lg bg-slate-950 border-offset-background">
                <QRCodeCanvas value={stellarMemo} size={100} level="H" />
                <p className="h-full text-center pointer-events-none whitespace-nowrap w-min text-slate-600">
                  Memo ID
                </p>
                <p className="w-full h-full overflow-hidden font-light text-start whitespace-nowrap">
                  {stellarMemo}
                </p>
                <Copy
                  className="h-full transition-all duration-300 ease-in-out transform cursor-pointer hover:text-primary hover:scale-110"
                  onClick={copyMemo}
                />
              </div>
              <p className="mt-2 text-sm text-red-600">
                * MEMO ID is required or you will lose your coins.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
