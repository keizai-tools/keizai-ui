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
  const publicKeyTest =
    'GBGE6C3EVOVCZPWEA5TXAH2FV5R3WNWLQWJFKAAN5UTXIR327M6XIO5R';

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
        className="mx-4 w-40 h-8 py-1 text-sm font-bold transition-all duration-300 ease-in-out transform border-2 whitespace-nowrap hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Recharge Wallet
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold select-none text-red-500">
              Both MEMO ID and address are required or you will lose your coins.
            </DialogTitle>
          </DialogHeader>
          {wallet.MAINNET?.publicKey && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Wallet Address</h3>
              <QRCodeCanvas value={publicKeyTest} size={100} level="H" />
              <p className="text-sm flex items-center gap-4">
                {publicKeyTest}
                <Copy
                  className="h-full transition-all duration-300 ease-in-out transform cursor-pointer hover:text-primary hover:scale-110"
                  onClick={copyWalletAddress}
                />
              </p>
              <h3 className="text-lg font-semibold mt-2">Memo ID</h3>
              <QRCodeCanvas value={stellarMemo} size={100} level="H" />
              <p className="text-sm flex items-center gap-4">
                {stellarMemo}
                <Copy
                  className="h-full transition-all duration-300 ease-in-out transform cursor-pointer hover:text-primary hover:scale-110"
                  onClick={copyMemo}
                />
                {/* <Button
                  onClick={() => ()}
                  variant="outline"
                  className="mx-4 w-40 h-8 py-1 text-sm font-bold transition-all duration-300 ease-in-out transform border-2 whitespace-nowrap hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Confirm payment
                </Button> */}
              </p>
              <p className="text-sm mt-2 text-red-600">
                * MEMO ID is required or you will lose your coins.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
