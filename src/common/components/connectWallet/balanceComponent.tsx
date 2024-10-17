import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { StoredCookies } from '@/modules/cookies/interfaces/cookies.enum';
import { cookieService } from '@/modules/cookies/services/cookie.service';

function BalanceComponent() {
  const [balance, setBalance] = useState<number>(
    parseFloat(cookieService.getCookie(StoredCookies.BALANCE) || '0'),
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>('Connecting...');

  useEffect(() => {
    const newSocket = io('http://localhost:3002', {
      autoConnect: true,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('Connected');
    });

    newSocket.on('balanceUpdate', (data) => {
      setBalance(data.balance);
      setBalanceCookie(data.balance);
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const setBalanceCookie = (balance: number): void => {
    try {
      cookieService.setBalanceCookie(balance);
    } catch (error) {
      console.error('Error setting balance cookie:', error);
    }
  };

  return <div>Balance Keizai: {balance.toFixed(2)}</div>;
}

export default BalanceComponent;
