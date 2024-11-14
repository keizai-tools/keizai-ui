import { useEffect, useState } from 'react';
import * as StellarSdk from 'stellar-sdk';

interface Balance {
  asset_type: string;
  balance: string;
}

interface StellarBalanceProps {
  publicKey?: string;
  networkBalance?: string;
}

function StellarBalance({
  publicKey,
  networkBalance = 'testnet',
}: Readonly<StellarBalanceProps>) {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      setError('');
      setBalances([]);

      if (!publicKey) {
        setError('No public key provided');
        return;
      }

      const networkUrl = getNetworkUrl(networkBalance);

      if (!networkUrl) {
        setError('The selected network is not valid.');
        return;
      }

      const server = new StellarSdk.Horizon.Server(networkUrl);

      try {
        const account = await server.loadAccount(publicKey);
        setBalances(account.balances);
      } catch (err) {
        console.error(err);
        setError('Error loading account');
      }
    };

    fetchBalance();
  }, [publicKey, networkBalance]);

  const getNetworkUrl = (networkBalance: string): string | null => {
    switch (networkBalance) {
      case 'testnet':
        return 'https://horizon-testnet.stellar.org';
      case 'mainnet':
        return 'https://horizon.stellar.org';
      case 'futurenet':
        return 'https://horizon-futurenet.stellar.org';
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-500 text-xs">{error}</p>}

      {balances.length > 0 && (
        <div className="flex items-center w-full gap-4 p-4 border-2 border-solid rounded-lg bg-slate-950 border-offset-background">
          <ul className="w-full">
            {balances.map((balance, index) => (
              <li key={index} className="flex items-center gap-4">
                <p className="h-full text-center pointer-events-none whitespace-nowrap w-min text-slate-600">
                  Balance
                </p>
                <p className="w-full h-full overflow-hidden font-light text-start whitespace-nowrap">
                  {balance.balance} - Asset Type: {balance.asset_type}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StellarBalance;
