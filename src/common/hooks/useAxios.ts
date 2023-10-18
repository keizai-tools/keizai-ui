import axios from 'axios';

import { useAuth } from '@/services/auth/hook/useAuth';

const useAxios = () => {
	const { user, isLoading, isAuthenticated } = useAuth();

	const instance = axios.create({
		baseURL: import.meta.env.VITE_URL_API_BASE,
	});
	instance.interceptors.request.use(
		(config) => {
			console.log({ user, isLoading, isAuthenticated });

			if (user?.accessToken) {
				config.headers.Authorization = `Bearer ${user.accessToken}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);

	return instance;
};

export default useAxios;
