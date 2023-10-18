import { Auth } from '@aws-amplify/auth';
import React from 'react';

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

					setIsAuthenticated(true);
					setUser(user);
					setIsLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setIsAuthenticated(false);
					setIsLoading(false);
				});
		}
	}, [user]);

	const signUp = ({ email, password }: { email: string; password: string }) => {
		return Auth.signUp({
			username: email,
			password,
			autoSignIn: {
				enabled: true,
			},
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

	return {
		user,
		isAuthenticated,
		isLoading,
		signUp,
		signIn,
		signOut,
	};
}
