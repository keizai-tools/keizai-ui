import { jwtDecode } from 'jwt-decode';
import Cookies from 'universal-cookie';

import { ICookieService } from '../interfaces/ICookieService';
import {
	ITokenPayload,
	ITokenPayloadCognito,
} from '../interfaces/ITokenPayload';
import { StoredCookies } from '../interfaces/cookies.enum';

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
}

export const cookieService = new CookieService<ITokenPayloadCognito>();
