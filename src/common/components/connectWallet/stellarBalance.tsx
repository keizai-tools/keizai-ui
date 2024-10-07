import { useEffect, useState } from 'react';
import * as StellarSdk from 'stellar-sdk';

interface Balance {
  asset_type: string;
  balance: string;
}

interface StellarBalanceProps {
  publicKey?: string;
  network?: 'testnet' | 'mainnet' | 'futurenet';
  title?: string;
}

function StellarBalance({
  title,
  publicKey,
  network = 'testnet',
}: Readonly<StellarBalanceProps>) {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      setError('');
      setBalances([]);

      if (!publicKey) {
        setError('Por favor, introduce una clave pública.');
        return;
      }

      const networkUrl = getNetworkUrl(network);

      if (!networkUrl) {
        setError('The selected network is not valid.');
        return;
      }

      const server = new StellarSdk.Horizon.Server(networkUrl);

      try {
        const account = await server.loadAccount(publicKey);
        console.log(account);

        setBalances(account.balances);
      } catch (err) {
        console.error(err);
        setError('Error loading account');
      }
    };

    fetchBalance();
  }, [publicKey, network]);

  const getNetworkUrl = (network: string): string | null => {
    switch (network) {
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
    <div>
      {error && <p className="text-red-500 text-xs">{error}</p>}

      {balances.length > 0 && (
        <div>
          <ul>
            {balances.map((balance, index) => (
              <li key={index} className="text-xs">
                Balance {title}: {balance.balance} - Asset Type:{' '}
                {balance.asset_type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StellarBalance;
