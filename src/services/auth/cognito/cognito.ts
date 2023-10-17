import {
	CognitoUser,
	CognitoUserPool,
	ICognitoUserData,
} from 'amazon-cognito-identity-js';

export const getUserPool = () => {
	const poolData = {
		UserPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
		ClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
		endpoint: import.meta.env.VITE_AWS_COGNITO_ENDPOINT,
	};
	const userPool = new CognitoUserPool(poolData);
	return userPool;
};

export const newCognitoUser = (userData: ICognitoUserData) => {
	return new CognitoUser(userData);
};
