import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteConfirmButtonProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	deleteMenuId: number | null;
	remove: UseMutationResult<any, any, any, any>;
	onSuccess: () => void;
}

export default function DeleteConfirmButton({
	isOpen,
	onOpenChange,
	deleteMenuId,
	remove,
	onSuccess,
}: DeleteConfirmButtonProps) {
	const handleDeleteConfirm = () => {
		if (deleteMenuId === null) return;

		remove.mutate(deleteMenuId, {
			onSuccess: () => {
				toast.success("Menu deleted successfully");
				onOpenChange(false);
				onSuccess();
			},
			onError: (error: any) => {
				toast.error(error?.message || "Failed to delete menu");
			},
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete the menu item from your navigation.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={remove.isPending}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeleteConfirm}
						disabled={remove.isPending}
						className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
					>
						{remove.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
