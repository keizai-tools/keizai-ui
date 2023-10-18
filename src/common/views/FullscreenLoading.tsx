import { Loader } from 'lucide-react';

const FullscreenLoading = () => {
	return (
		<div className="flex items-center justify-center w-full h-screen">
			<Loader className="animate-spin" size="36" />
		</div>
	);
};

export default FullscreenLoading;
