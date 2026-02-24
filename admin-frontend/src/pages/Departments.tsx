import {
	Building2,
	Loader2,
	Pencil,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { useDepartments } from "@/hooks/useDepartments";
import type { Department } from "@/types/Notification.types";

// ─── Department Form Dialog ───────────────────────────────────────────────────

interface FormDialogProps {
	isOpen: boolean;
	onOpenChange: (v: boolean) => void;
	editing: Department | null;
	isPending: boolean;
	onSubmit: (name: string) => void;
}

function DepartmentFormDialog({
	isOpen,
	onOpenChange,
	editing,
	isPending,
	onSubmit,
}: FormDialogProps) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const name = (fd.get("name") as string).trim();
		if (!name) return;
		onSubmit(name);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="bg-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Edit Department" : "Add Department"}
					</DialogTitle>
					<DialogDescription>
						{editing
							? "Update the department name below."
							: "Enter a name for the new department."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div className="grid gap-1.5">
						<Label htmlFor="name">Department Name *</Label>
						<Input
							id="name"
							name="name"
							defaultValue={editing?.name ?? ""}
							placeholder="e.g. Computer Science & Engineering"
							required
							autoFocus
						/>
					</div>

					<DialogFooter className="pt-2">
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
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : editing ? (
								"Save Changes"
							) : (
								"Add Department"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteDialogProps {
	department: Department | null;
	onConfirm: () => void;
	onCancel: () => void;
	isPending: boolean;
}

function DeleteConfirmDialog({
	department,
	onConfirm,
	onCancel,
	isPending,
}: DeleteDialogProps) {
	return (
		<Dialog open={!!department} onOpenChange={(v) => !v && onCancel()}>
			<DialogContent className="bg-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-red-600">
						Delete Department
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete{" "}
						<span className="font-semibold text-slate-800">
							"{department?.name}"
						</span>
						? This action cannot be undone. Notifications linked to
						this department will lose their department reference.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="pt-2">
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isPending}
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							"Delete Department"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DepartmentsPage() {
	const { data: departments, isLoading, isError, create, update, remove } =
		useDepartments();

	const [search, setSearch] = useState("");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingDept, setEditingDept] = useState<Department | null>(null);
	const [deletingDept, setDeletingDept] = useState<Department | null>(null);

	const filtered = departments?.filter((d) =>
		d.name.toLowerCase().includes(search.toLowerCase()),
	) ?? [];

	const handleCreate = (name: string) => {
		create.mutate(
			{ name },
			{
				onSuccess: () => {
					toast.success("Department created");
					setIsFormOpen(false);
				},
				onError: () => toast.error("Failed to create department"),
			},
		);
	};

	const handleUpdate = (name: string) => {
		if (!editingDept) return;
		update.mutate(
			{ id: editingDept.id, data: { name } },
			{
				onSuccess: () => {
					toast.success("Department updated");
					setEditingDept(null);
					setIsFormOpen(false);
				},
				onError: () => toast.error("Failed to update department"),
			},
		);
	};

	const handleDelete = () => {
		if (!deletingDept) return;
		remove.mutate(deletingDept.id, {
			onSuccess: () => {
				toast.success("Department deleted");
				setDeletingDept(null);
			},
			onError: () => toast.error("Failed to delete department"),
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="flex items-center gap-2 text-slate-400 animate-pulse font-medium">
					<Loader2 className="h-5 w-5 animate-spin" />
					Loading Departments...
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<p className="text-red-500 font-medium">
					Failed to load departments. Please refresh the page.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="mx-auto w-full max-w-3xl space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
							<Building2 className="h-6 w-6 text-indigo-600" />
							Departments
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Manage university departments. Departments can be
							linked to notifications and staff profiles.
						</p>
					</div>
					<Button
						onClick={() => {
							setEditingDept(null);
							setIsFormOpen(true);
						}}
						className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm self-start sm:self-auto"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Department
					</Button>
				</div>

				{/* Search + count */}
				<div className="flex items-center gap-3">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
						<Input
							placeholder="Search departments..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 bg-white border-slate-200"
						/>
						{search && (
							<button
								onClick={() => setSearch("")}
								className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>
					<span className="text-xs rounded-full px-3 py-1 bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
						{departments?.length ?? 0} total
					</span>
				</div>

				{/* Table */}
				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
					{/* Header row */}
					<div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-1">#</div>
						<div className="col-span-9">Department Name</div>
						<div className="col-span-2 text-right">Actions</div>
					</div>

					{/* Rows */}
					<div className="divide-y divide-slate-100">
						{filtered.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-slate-400">
								<Building2 className="h-10 w-10 mb-3 opacity-30" />
								<p className="font-medium">
									{search
										? "No departments match your search."
										: "No departments yet."}
								</p>
								{!search && (
									<p className="text-sm mt-1">
										Click "Add Department" to create your
										first one.
									</p>
								)}
							</div>
						) : (
							filtered.map((dept, index) => (
								<div
									key={dept.id}
									className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
								>
									{/* Index */}
									<div className="col-span-1 text-xs text-slate-400 font-mono">
										{index + 1}
									</div>

									{/* Name */}
									<div className="col-span-9">
										<p className="text-sm font-medium text-slate-800">
											{dept.name}
										</p>
										<p className="text-xs text-slate-400 mt-0.5">
											ID: {dept.id}
										</p>
									</div>

									{/* Actions */}
									<div className="col-span-2 flex items-center justify-end gap-1">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
											title="Edit department"
											onClick={() => {
												setEditingDept(dept);
												setIsFormOpen(true);
											}}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
											title="Delete department"
											onClick={() =>
												setDeletingDept(dept)
											}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Create / Edit dialog */}
			<DepartmentFormDialog
				isOpen={isFormOpen}
				onOpenChange={(v) => {
					setIsFormOpen(v);
					if (!v) setEditingDept(null);
				}}
				editing={editingDept}
				isPending={create.isPending || update.isPending}
				onSubmit={editingDept ? handleUpdate : handleCreate}
			/>

			{/* Delete confirm dialog */}
			<DeleteConfirmDialog
				department={deletingDept}
				onConfirm={handleDelete}
				onCancel={() => setDeletingDept(null)}
				isPending={remove.isPending}
			/>
		</>
	);
}
