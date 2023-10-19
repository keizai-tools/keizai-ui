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

import { useDeleteCollectionMutation } from '@/common/api/collections';

const DeleteCollectionDialog = ({
	open,
	onOpenChange,
	id,
}: {
	open: boolean;
	onOpenChange: () => void;
	id: string;
}) => {
	const { mutate: deleteCollectionMutation } = useDeleteCollectionMutation();

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete your collection and all of its
						contents.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onOpenChange()}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={() => deleteCollectionMutation(id)}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteCollectionDialog;
