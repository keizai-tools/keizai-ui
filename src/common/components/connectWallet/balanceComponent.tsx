import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { StoredCookies } from '@/modules/cookies/interfaces/cookies.enum';
import { cookieService } from '@/modules/cookies/services/cookie.service';
import { userService } from '@/modules/user/services/user.service';

function BalanceComponent() {
  const [balance, setBalance] = useState<number>(
    parseFloat(cookieService.getCookie(StoredCookies.BALANCE) || '0'),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshBalance = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await userService.UserMe();
      const updatedBalance = response.payload.balance;

      await new Promise((resolve) => setTimeout(resolve, 500));

      setBalance(updatedBalance);
      cookieService.setBalanceCookie(updatedBalance);
    } catch (error) {
      console.error('Error al actualizar el balance:', error);
      setMessage('Error al actualizar el balance. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div>Balance Keizai: {balance.toFixed(2)} USDC</div>
      <button onClick={refreshBalance} disabled={loading}>
        <RefreshCw className={loading ? 'animate-spin' : ''} size="20" />
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default BalanceComponent;
