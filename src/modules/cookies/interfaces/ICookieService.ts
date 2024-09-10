import { ITokenPayload } from './ITokenPayload';
import { StoredCookies } from './cookies.enum';

import { NETWORK } from '@/common/types/soroban.enum';
import {
  IWalletContent,
  IWallet,
} from '@/modules/auth/interfaces/IAuthenticationContext';

export interface ICookieService<T extends ITokenPayload> {
  setEmailCookie: (username: string, expiresIn: number) => void;
  setRefreshTokenCookie: (refreshToken: string, expiresIn: number) => void;
  setAccessTokenCookie: (accessToken: string) => void;
  getCookie: (name: StoredCookies) => string | undefined;
  remove: (name: StoredCookies) => void;
  removeAll: () => void;
  decodeToken: (token: string) => T | null;
  setWalletCookie(wallet: IWalletContent): void;
  getWalletCookie(network: NETWORK): IWalletContent | null;
  getAllWalletCookies(): IWallet;
  removeAllWalletCookies(): void;
  removeWalletCookie(network: NETWORK): void;
}
