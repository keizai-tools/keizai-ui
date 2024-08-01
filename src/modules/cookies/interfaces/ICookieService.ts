import { ITokenPayload } from './ITokenPayload';
import { StoredCookies } from './cookies.enum';

export interface ICookieService<T extends ITokenPayload> {
	setEmailCookie: (username: string, expiresIn: number) => void;
	setRefreshTokenCookie: (refreshToken: string, expiresIn: number) => void;
	setAccessTokenCookie: (accessToken: string) => void;
	getCookie: (name: StoredCookies) => string | undefined;
	remove: (name: StoredCookies) => void;
	removeAll: () => void;
	decodeToken: (token: string) => T | null;
}
