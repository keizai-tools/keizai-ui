import { Loader } from 'lucide-react';

const OverlayLoading = () => {
	const opacity = 0.2;
	return (
		<div
			className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
			style={{
				backgroundColor: `hsla(222.2, 84%, 4.9%, ${opacity})`,
			}}
		>
			<Loader className="animate-spin" size="36" />
		</div>
	);
};

export default OverlayLoading;
