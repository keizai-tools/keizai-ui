import { Auth } from '@aws-amplify/auth';
import React from 'react';

import { User } from '../domain/user';

import useAxios from '@/common/hooks/useAxios';
import { AuthContext } from '@/providers/AuthProvider';

const amplifyConfigurationOptions = {
	userPoolRegion: import.meta.env.VITE_AWS_COGNITO_REGION,
	userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
	userPoolWebClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
};

Auth.configure(amplifyConfigurationOptions);

export const useAuth = () => React.useContext(AuthContext);

export type AuthUser = {
	email: string;
	accessToken: string;
};

export function useProvideAuth() {
	const axios = useAxios();
	const [user, setUser] = React.useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	React.useEffect(() => {
		if (!user) {
			setIsLoading(true);
			Auth.currentSession()
				.then((session) => {
					const accessToken = session.getAccessToken();
					const idToken = session.getIdToken();

					const user = {
						email: idToken.payload.email,
						accessToken: accessToken.getJwtToken(),
					};

					setUser(user);
					setIsLoading(false);
					setIsAuthenticated(true);
				})
				.catch((err) => {
					console.log(err);
					setIsAuthenticated(false);
					setIsLoading(false);
				});
		}
	}, [user]);

	const signUp = async (userData: User) => {
		await axios.post('/auth/register', {
			username: userData.email,
			password: userData.password,
		});
	};

	const signIn = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		const cognitoUser = await Auth.signIn(email, password);
		const {
			attributes,
			signInUserSession: { accessToken },
		} = cognitoUser;

		const user = {
			email: attributes.email,
			accessToken: accessToken.jwtToken,
		};

		setIsAuthenticated(true);
		setUser(user);

		return user;
	};

	const signOut = () =>
		Auth.signOut().then(() => {
			setIsAuthenticated(false);
			setUser(null);
		});

	async function forgotPassword(username: string) {
		try {
			const data = await Auth.forgotPassword(username);
			if (data) {
				setUser({
					email: username,
					accessToken: '',
				});
			}
		} catch (err) {
			throw new Error('Cannot send code, please try again');
		}
	}

	async function forgotPasswordSubmit({
		code,
		newPassword,
	}: {
		code: string;
		newPassword: string;
	}) {
		let username = '';
		if (user !== null) {
			username = user.email;
		}
		return await Auth.forgotPasswordSubmit(username, code, newPassword);
	}

	return {
		user,
		isAuthenticated,
		isLoading,
		signUp,
		signIn,
		signOut,
		forgotPassword,
		forgotPasswordSubmit,
	};
}
