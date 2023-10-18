import axios from 'axios';

import { useAuth } from '@/services/auth/hook/useAuth';

const useAxios = () => {
	const { user } = useAuth();

	const instance = axios.create({
		baseURL: import.meta.env.VITE_URL_API_BASE,
	});
	instance.interceptors.request.use(
		(config) => {
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
