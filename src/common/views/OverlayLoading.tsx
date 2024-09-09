import { Loader } from 'lucide-react';

function OverlayLoading() {
	const opacity = 0.2;
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
			style={{
				backgroundColor: `hsla(222.2, 84%, 4.9%, ${opacity})`,
			}}
		>
			<Loader className="animate-spin" size="36" />
		</div>
	);
}

export default OverlayLoading;
