import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/common/components/ui/toast';
import { useToast } from '@/common/components/ui/useToast';

('use client');

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Toast key={id} className="my-1" {...props}>
						<div className="grid gap-1" data-test="toast-container">
							{title && <ToastTitle data-test="toast-tile">{title}</ToastTitle>}
							{description && (
								<ToastDescription data-test="toast-description">
									{description}
								</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
