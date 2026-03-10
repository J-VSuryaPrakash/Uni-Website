import {
	Loader2,
	Pencil,
	Plus,
	Search,
	Tag,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDesignations } from "@/hooks/useDesignations";
import type { Designation } from "@/types/Faculty.types";
import type { CreateDesignationDTO } from "@/api/designations.api";

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
	{ value: "ADMINISTRATION", label: "Administration" },
	{ value: "DIRECTORATES", label: "Directorates" },
	{ value: "PRINCIPALS", label: "Principals" },
	{ value: "EXAMINATION", label: "Examination" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
	ADMINISTRATION: "bg-blue-50 text-blue-700 border-blue-200",
	DIRECTORATES: "bg-green-50 text-green-700 border-green-200",
	PRINCIPALS: "bg-purple-50 text-purple-700 border-purple-200",
	EXAMINATION: "bg-amber-50 text-amber-700 border-amber-200",
};

// ─── Form Dialog ──────────────────────────────────────────────────────────────

interface FormDialogProps {
	isOpen: boolean;
	onOpenChange: (v: boolean) => void;
	editing: Designation | null;
	isPending: boolean;
	onSubmit: (data: CreateDesignationDTO) => void;
}

function DesignationFormDialog({
	isOpen,
	onOpenChange,
	editing,
	isPending,
	onSubmit,
}: FormDialogProps) {
	const [category, setCategory] = useState<CreateDesignationDTO["category"]>(
		editing?.category ?? "ADMINISTRATION",
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const title = (fd.get("title") as string).trim();
		const priority = Number(fd.get("priority"));
		if (!title) return;
		onSubmit({ title, priority, category });
	};

	// Reset category when editing changes
	const handleOpenChange = (v: boolean) => {
		if (v) setCategory(editing?.category ?? "ADMINISTRATION");
		onOpenChange(v);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="bg-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Edit Designation" : "Add Designation"}
					</DialogTitle>
					<DialogDescription>
						{editing
							? "Update designation details below."
							: "Enter details for the new designation."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div className="grid gap-1.5">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							name="title"
							defaultValue={editing?.title ?? ""}
							placeholder="e.g. Professor, Director"
							required
							autoFocus
						/>
					</div>

					<div className="grid gap-1.5">
						<Label htmlFor="category">Category *</Label>
						<Select
							value={category}
							onValueChange={(v) =>
								setCategory(v as CreateDesignationDTO["category"])
							}
						>
							<SelectTrigger id="category" className="bg-white">
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORY_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-1.5">
						<Label htmlFor="priority">Priority *</Label>
						<Input
							id="priority"
							name="priority"
							type="number"
							min={0}
							defaultValue={editing?.priority ?? 0}
							required
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
								"Add Designation"
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
	designation: Designation | null;
	onConfirm: () => void;
	onCancel: () => void;
	isPending: boolean;
}

function DeleteConfirmDialog({
	designation,
	onConfirm,
	onCancel,
	isPending,
}: DeleteDialogProps) {
	return (
		<Dialog open={!!designation} onOpenChange={(v) => !v && onCancel()}>
			<DialogContent className="bg-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-red-600">
						Delete Designation
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete{" "}
						<span className="font-semibold text-slate-800">
							"{designation?.title}"
						</span>
						? This action cannot be undone.
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
							"Delete Designation"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DesignationsPage() {
	const { data: designations, isLoading, isError, create, update, remove } =
		useDesignations();

	const [search, setSearch] = useState("");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingDesig, setEditingDesig] = useState<Designation | null>(null);
	const [deletingDesig, setDeletingDesig] = useState<Designation | null>(null);

	const filtered = (designations ?? []).filter((d) =>
		d.title.toLowerCase().includes(search.toLowerCase()),
	);

	const handleCreate = (data: CreateDesignationDTO) => {
		create.mutate(data, {
			onSuccess: () => {
				toast.success("Designation created");
				setIsFormOpen(false);
			},
			onError: () => toast.error("Failed to create designation"),
		});
	};

	const handleUpdate = (data: CreateDesignationDTO) => {
		if (!editingDesig) return;
		update.mutate(
			{ id: editingDesig.id, data },
			{
				onSuccess: () => {
					toast.success("Designation updated");
					setEditingDesig(null);
					setIsFormOpen(false);
				},
				onError: () => toast.error("Failed to update designation"),
			},
		);
	};

	const handleDelete = () => {
		if (!deletingDesig) return;
		remove.mutate(deletingDesig.id, {
			onSuccess: () => {
				toast.success("Designation deleted");
				setDeletingDesig(null);
			},
			onError: () => toast.error("Failed to delete designation"),
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="flex items-center gap-2 text-slate-400 animate-pulse font-medium">
					<Loader2 className="h-5 w-5 animate-spin" />
					Loading Designations...
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<p className="text-red-500 font-medium">
					Failed to load designations. Please refresh the page.
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
							<Tag className="h-6 w-6 text-indigo-600" />
							Designations
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Manage job titles and roles for staff members.
						</p>
					</div>
					<Button
						onClick={() => {
							setEditingDesig(null);
							setIsFormOpen(true);
						}}
						className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm self-start sm:self-auto"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Designation
					</Button>
				</div>

				{/* Search + count */}
				<div className="flex items-center gap-3">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
						<Input
							placeholder="Search designations..."
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
						{designations?.length ?? 0} total
					</span>
				</div>

				{/* Table */}
				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
					{/* Header row */}
					<div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-1">#</div>
						<div className="col-span-4">Title</div>
						<div className="col-span-4">Category</div>
						<div className="col-span-1 text-center">Priority</div>
						<div className="col-span-2 text-right">Actions</div>
					</div>

					{/* Rows */}
					<div className="divide-y divide-slate-100">
						{filtered.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-slate-400">
								<Tag className="h-10 w-10 mb-3 opacity-30" />
								<p className="font-medium">
									{search
										? "No designations match your search."
										: "No designations yet."}
								</p>
								{!search && (
									<p className="text-sm mt-1">
										Click "Add Designation" to create your
										first one.
									</p>
								)}
							</div>
						) : (
							filtered.map((desig, index) => (
								<div
									key={desig.id}
									className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
								>
									<div className="col-span-1 text-xs text-slate-400 font-mono">
										{index + 1}
									</div>
									<div className="col-span-4">
										<p className="text-sm font-medium text-slate-800">
											{desig.title}
										</p>
										<p className="text-xs text-slate-400 mt-0.5">
											ID: {desig.id}
										</p>
									</div>
									<div className="col-span-4">
										<span
											className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
												CATEGORY_COLORS[desig.category] ??
												"bg-slate-50 text-slate-600 border-slate-200"
											}`}
										>
											{CATEGORY_OPTIONS.find(
												(c) => c.value === desig.category,
											)?.label ?? desig.category}
										</span>
									</div>
									<div className="col-span-1 text-center text-sm text-slate-600 font-mono">
										{desig.priority}
									</div>
									<div className="col-span-2 flex items-center justify-end gap-1">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
											title="Edit designation"
											onClick={() => {
												setEditingDesig(desig);
												setIsFormOpen(true);
											}}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
											title="Delete designation"
											onClick={() =>
												setDeletingDesig(desig)
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
			<DesignationFormDialog
				isOpen={isFormOpen}
				onOpenChange={(v) => {
					setIsFormOpen(v);
					if (!v) setEditingDesig(null);
				}}
				editing={editingDesig}
				isPending={create.isPending || update.isPending}
				onSubmit={editingDesig ? handleUpdate : handleCreate}
			/>

			{/* Delete confirm dialog */}
			<DeleteConfirmDialog
				designation={deletingDesig}
				onConfirm={handleDelete}
				onCancel={() => setDeletingDesig(null)}
				isPending={remove.isPending}
			/>
		</>
	);
}
