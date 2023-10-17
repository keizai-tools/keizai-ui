import axios, { AxiosResponse } from 'axios';
import { ChangeEvent, useState } from 'react';

import { getUserPool, newCognitoUser } from '../cognito/cognito';

import { User } from '@/services/auth/domain/user';
import { AUTH_RESPONSE } from '@/services/auth/validators/authResponse';

const INITIAL_VALUES: User = {
	username: '',
	password: '',
};

const URL_API_BASE: string = import.meta.env.VITE_URL_API_BASE;

function useAuth() {
	const [formData, setFormData] = useState<User>(INITIAL_VALUES);

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	async function loginUser(userData: User): Promise<AxiosResponse> {
		try {
			const url = `${URL_API_BASE}/auth/login`;
			return await axios.post(url, userData);
		} catch (error) {
			throw new Error(AUTH_RESPONSE.FAILED_LOGIN);
		}
	}

	async function registerUser(userData: User): Promise<AxiosResponse> {
		try {
			const url = `${URL_API_BASE}/auth/register`;
			return await axios.post(url, userData);
		} catch (error) {
			throw new Error(AUTH_RESPONSE.FAILED_REGSTER);
		}
	}

	async function logoutUser(username: string) {
		const userPool = getUserPool();
		const userData = {
			Username: username,
			Pool: userPool,
		};
		const cognitoUser = newCognitoUser(userData);

		try {
			cognitoUser.signOut();
			return true;
		} catch (error) {
			throw new Error(AUTH_RESPONSE.FAILED_LOGOUT);
		}
	}

	return { formData, onChangeInput, loginUser, logoutUser, registerUser };
}

export default useAuth;
