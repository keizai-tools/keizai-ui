import { jwtDecode } from 'jwt-decode';
import Cookies from 'universal-cookie';

import { ICookieService } from '../interfaces/ICookieService';
import {
  ITokenPayload,
  ITokenPayloadCognito,
} from '../interfaces/ITokenPayload';
import { StoredCookies } from '../interfaces/cookies.enum';

import { BACKEND_NETWORK, NETWORK } from '@/common/types/soroban.enum';
import {
  IWalletContent,
  IWallet,
} from '@/modules/auth/interfaces/IAuthenticationContext';

class CookieService<T extends ITokenPayload> implements ICookieService<T> {
  cookies: Cookies;

  constructor() {
    try {
      this.cookies = new Cookies({ path: '/' });
    } catch (error) {
      console.error('Error initializing cookies:', error);
      throw error;
    }
  }

  setEmailCookie(email: string, expiresIn: number): void {
    try {
      const expires = new Date(
        Date.now() + (expiresIn || 1000 * 60 * 60 * 24 * 30),
      );
      this.cookies.set(StoredCookies.EMAIL, email, { expires, path: '/' });
    } catch (error) {
      console.error('Error setting email cookie:', error);
    }
  }

  setRefreshTokenCookie(refreshToken: string, expiresIn: number): void {
    try {
      const expires = new Date(
        Date.now() + (expiresIn || 1000 * 60 * 60 * 24 * 30),
      );
      this.cookies.set(StoredCookies.REFRESH_TOKEN, refreshToken, {
        expires,
        path: '/',
      });
    } catch (error) {
      console.error('Error setting refresh token cookie:', error);
    }
  }

  setAccessTokenCookie(accessToken: string): void {
    try {
      this.cookies.set(StoredCookies.ACCESS_TOKEN, accessToken, { path: '/' });
    } catch (error) {
      console.error('Error setting access token cookie:', error);
    }
  }

  setMemoIdCookie(memoId: string): void {
    try {
      this.cookies.set(StoredCookies.MEMO_ID, memoId, { path: '/' });
    } catch (error) {
      console.error('Error setting memoId cookie:', error);
    }
  }

  setBalanceCookie(balance: number): void {
    try {
      this.cookies.set(StoredCookies.BALANCE, balance, { path: '/' });
    } catch (error) {
      console.error('Error setting balance cookie:', error);
    }
  }

  getCookie(name: StoredCookies): string | undefined {
    try {
      return this.cookies.get(name);
    } catch (error) {
      console.error(`Error getting cookie ${name}:`, error);
      return undefined;
    }
  }

  remove(name: StoredCookies): void {
    try {
      const cookieExists = this.cookies.get(name);
      if (cookieExists) {
        this.cookies.remove(name, { path: '/' });
      } else {
        console.warn(`Cookie with name ${name} does not exist.`);
      }
    } catch (error) {
      console.error(`Error removing cookie ${name}:`, error);
    }
  }

  removeAll(): void {
    for (const cookie of Object.values(StoredCookies)) {
      try {
        this.remove(cookie as StoredCookies);
      } catch (error) {
        console.error('Error removing all cookies:', error);
      }
    }
  }

  decodeToken(token: string): T | null {
    try {
      return jwtDecode<T>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  setWalletCookie(wallet: IWalletContent): void {
    try {
      this.cookies.set(wallet.network, wallet, { path: '/' });
    } catch (error) {
      console.error('Error setting wallet cookie:', error);
    }
  }

  removeWalletCookie(network: NETWORK): void {
    try {
      this.cookies.remove(network, { path: '/' });
    } catch (error) {
      console.error('Error removing wallet cookie:', error);
    }
  }

  removeAllWalletCookies(): void {
    for (const network of Object.values(NETWORK)) {
      try {
        this.removeWalletCookie(network);
      } catch (error) {
        console.error('Error removing all wallet cookies:', error);
      }
    }
  }

  getAllWalletCookies(): IWallet {
    const wallets: IWallet = {
      [BACKEND_NETWORK.SOROBAN_MAINNET]: null,
      [BACKEND_NETWORK.SOROBAN_TESTNET]: null,
      [BACKEND_NETWORK.SOROBAN_FUTURENET]: null,
      [BACKEND_NETWORK.AUTO_DETECT]: null,
    };

    for (const network of Object.values(NETWORK)) {
      const wallet = this.parseCookie(network);
      if (wallet) {
        wallets[network] = wallet;
      }
    }

    return wallets;
  }

  getWalletCookie(network: NETWORK): IWalletContent | null {
    return this.parseCookie(network);
  }

  private parseCookie(network: NETWORK): IWalletContent | null {
    try {
      const cookie = this.cookies.get(network, { doNotParse: true });
      return cookie ? (JSON.parse(cookie as string) as IWalletContent) : null;
    } catch (error) {
      console.error('Error parsing cookie:', error);
      return null;
    }
  }
}

export const cookieService = new CookieService<ITokenPayloadCognito>();
