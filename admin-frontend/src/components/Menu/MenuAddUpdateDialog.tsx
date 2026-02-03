import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface MenuData {
	id: number;
	name: string;
	slug: string;
	position: number;
	isActive: boolean;
}

interface MenuAddUpdateDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	editingMenu: MenuData | null;
	filteredMenus: MenuData[];
	create: UseMutationResult<any, any, any, any>;
	update: UseMutationResult<any, any, any, any>;
	onSuccess: () => void;
}

export default function MenuAddUpdateDialog({
	isOpen,
	onOpenChange,
	editingMenu,
	filteredMenus,
	create,
	update,
	onSuccess,
}: MenuAddUpdateDialogProps) {
	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const data = {
			name: formData.get("name") as string,
			slug: formData.get("slug") as string,
			position: Number(formData.get("position")),
			isActive: formData.get("isActive") === "on",
		};

		if (editingMenu) {
			update.mutate(
				{ id: editingMenu.id, data },
				{
					onSuccess: () => {
						toast.success("Menu updated successfully");
						onOpenChange(false);
						onSuccess();
					},
					onError: (error: any) => {
						toast.error(error?.message || "Failed to update menu");
					},
				},
			);
		} else {
			create.mutate(data, {
				onSuccess: () => {
					toast.success("Menu created successfully");
					onOpenChange(false);
					onSuccess();
				},
				onError: (error: any) => {
					toast.error(error?.message || "Failed to create menu");
				},
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-106.25 bg-white">
				<DialogHeader>
					<DialogTitle>
						{editingMenu ? "Edit Menu" : "Create Menu"}
					</DialogTitle>
					<DialogDescription>
						{editingMenu
							? "Make changes to the menu item here. Click save when you're done."
							: "Add a new menu item to your navigation."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSave} className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							defaultValue={editingMenu?.name}
							placeholder="e.g. About Us"
							required
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="slug">Slug</Label>
						<Input
							id="slug"
							name="slug"
							defaultValue={editingMenu?.slug}
							placeholder="e.g. about-us"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="position">Position</Label>
							<Input
								id="position"
								name="position"
								type="number"
								defaultValue={
									editingMenu?.position ??
									filteredMenus.length
								}
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="isActive">Status</Label>
							<div className="flex items-center space-x-2 h-10 border rounded-md px-3">
								<Switch
									id="isActive"
									name="isActive"
									defaultChecked={
										editingMenu?.isActive ?? true
									}
								/>
								<Label
									htmlFor="isActive"
									className="font-normal text-slate-600 cursor-pointer"
								>
									Active
								</Label>
							</div>
						</div>
					</div>

					<DialogFooter className="mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-indigo-600 hover:bg-indigo-700"
							disabled={create.isPending || update.isPending}
						>
							{create.isPending || update.isPending
								? "Saving..."
								: editingMenu
									? "Save Changes"
									: "Create Menu"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
