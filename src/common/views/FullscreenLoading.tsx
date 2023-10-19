import { Loader } from 'lucide-react';

const FullscreenLoading = () => {
	return (
		<div className="flex items-center justify-center w-screen h-screen bg-background">
			<Loader className="animate-spin" size="36" />
		</div>
	);
};

export default FullscreenLoading;
