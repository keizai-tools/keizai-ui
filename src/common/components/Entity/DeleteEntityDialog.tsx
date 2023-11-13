import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../ui/alert-dialog';

const DeleteEntityDialog = ({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: () => void;
	title: string;
	description: string;
	onConfirm: () => void;
}) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent data-test="delete-entity-dialog-container">
				<AlertDialogHeader>
					<AlertDialogTitle data-test="delete-entity-dialog-title">
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription data-test="delete-entity-dialog-description">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={() => onOpenChange()}
						data-test="delete-entity-dialog-btn-cancel"
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						data-test="delete-entity-dialog-btn-continue"
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteEntityDialog;
