import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePages } from "../hooks/usePage";
import SortableRow from "@/components/Pages/SortableRow";

// --- Types ---
interface SeoMeta {
	title: string;
	keywords: string[];
	description: string;
}

interface PageData {
	id: number;
	menuId: number;
	parentId: number | null;
	title: string;
	slug: string;
	position: number;
	status: string; // e.g., "published", "draft"
	seoMeta: SeoMeta;
}

// --- Main Page Component ---
export default function Pages() {
	const { data: pages, create, update, remove, reorder } = usePages();

	// State
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingPage, setEditingPage] = useState<PageData | null>(null);
	const [deletePageId, setDeletePageId] = useState<number | null>(null);

	// Status Select State (for the controlled input in Dialog)
	const [selectedStatus, setSelectedStatus] = useState("published");

	// Dnd Sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	const isLoading = !pages;

	// Filtered Data
	const filteredPages = useMemo(() => {
		if (!pages) return [];
		return pages.filter(
			(page) =>
				page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				page.slug.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [pages, searchQuery]);

	// Handlers
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id || !pages) return;

		const oldIndex = pages.findIndex((p) => p.id === active.id);
		const newIndex = pages.findIndex((p) => p.id === over.id);

		const updated = arrayMove(pages, oldIndex, newIndex);

		reorder.mutate(
			updated.map((p, i) => ({ id: p.id, position: i })),
			{
				onSuccess: () => {
					toast.success("Pages reordered successfully");
				},
				onError: (error: any) => {
					toast.error(error?.message || "Failed to reorder pages");
				},
			},
		);
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		// Parse SEO Keywords (comma separated string -> array)
		const keywordsString = formData.get("seoKeywords") as string;
		const keywordsArray = keywordsString
			.split(",")
			.map((k) => k.trim())
			.filter((k) => k);

		const data = {
			title: formData.get("title") as string,
			slug: formData.get("slug") as string,
			menuId: Number(formData.get("menuId")),
			parentId: formData.get("parentId")
				? Number(formData.get("parentId"))
				: null,
			position: Number(formData.get("position")),
			status: selectedStatus,
			seoMeta: {
				title: formData.get("seoTitle") as string,
				description: formData.get("seoDescription") as string,
				keywords: keywordsArray,
			},
		};

		if (editingPage) {
			update.mutate(
				{ id: editingPage.id, data },
				{
					onSuccess: () => {
						toast.success("Page updated successfully");
						setEditingPage(null);
					},
					onError: (error: any) => {
						toast.error(error?.message || "Failed to update page");
					},
				},
			);
		} else {
			create.mutate(data, {
				onSuccess: () => {
					toast.success("Page created successfully");
					setIsAddOpen(false);
				},
				onError: (error: any) => {
					toast.error(error?.message || "Failed to create page");
				},
			});
		}
	};

	const openEdit = (page: PageData) => {
		setSelectedStatus(page.status);
		setEditingPage(page);
	};

	const openCreate = () => {
		setSelectedStatus("published");
		setIsAddOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (deletePageId === null) return;

		remove.mutate(deletePageId, {
			onSuccess: () => {
				toast.success("Page deleted successfully");
				setDeletePageId(null);
			},
			onError: (error: any) => {
				toast.error(error?.message || "Failed to delete page");
			},
		});
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-slate-50">
				<div className="text-slate-400 animate-pulse font-medium">
					Loading Pages...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50/50 p-8 font-sans">
			<div className="mx-auto max-w-6xl space-y-8">
				{/* Top Header Section */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900">
							Pages
						</h1>
						<p className="text-sm text-slate-500">
							Create and manage content pages.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search pages..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full sm:w-64 pl-9 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
							/>
						</div>

						<Button
							onClick={openCreate}
							className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all"
						>
							<Plus className="mr-2 h-4 w-4" /> Add Page
						</Button>
					</div>
				</div>

				{/* Content Section */}
				<div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
					{/* Table Header */}
					<div className="grid grid-cols-13 gap-4 border-b border-slate-200 bg-slate-50/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-1 text-center">Order</div>
						<div className="col-span-1">ID</div>
						<div className="col-span-3">Title</div>
						<div className="col-span-2">Slug</div>
						<div className="col-span-1 text-center">Parent</div>
						<div className="col-span-1 text-center">Menu</div>
						<div className="col-span-2 text-center">Status</div>
						<div className="col-span-2 text-right">Actions</div>
					</div>

					{/* Sortable List */}
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={filteredPages.map((p) => p.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="divide-y divide-slate-100">
								{filteredPages.length > 0 ? (
									filteredPages.map((page) => (
										<SortableRow
											key={page.id}
											page={page}
											onEdit={openEdit}
											onDelete={setDeletePageId}
										/>
									))
								) : (
									<div className="p-12 text-center text-slate-500">
										No pages found.
									</div>
								)}
							</div>
						</SortableContext>
					</DndContext>
				</div>
			</div>

			{/* --- Add/Edit Dialog --- */}
			<Dialog
				open={isAddOpen || !!editingPage}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingPage(null);
					}
				}}
			>
				<DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingPage ? "Edit Page" : "Create New Page"}
						</DialogTitle>
						<DialogDescription>
							Fill in the details for your page content and SEO
							settings.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSave} className="grid gap-6 py-4">
						{/* General Info Section */}
						<div className="grid gap-4">
							<h4 className="text-sm font-medium text-slate-900 border-b pb-2">
								General Information
							</h4>

							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										name="title"
										defaultValue={editingPage?.title}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										name="slug"
										defaultValue={editingPage?.slug}
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="menuId">Menu ID</Label>
									<Input
										id="menuId"
										name="menuId"
										type="number"
										defaultValue={editingPage?.menuId}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="parentId">Parent ID</Label>
									<Input
										id="parentId"
										name="parentId"
										type="number"
										placeholder="Optional"
										defaultValue={
											editingPage?.parentId ?? ""
										}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="status">Status</Label>
									<Select
										value={selectedStatus}
										onValueChange={setSelectedStatus}
									>
										<SelectTrigger>
											<SelectValue placeholder="Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="published">
												Published
											</SelectItem>
											<SelectItem value="draft">
												Draft
											</SelectItem>
											<SelectItem value="archived">
												Archived
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="position">Position</Label>
								<Input
									id="position"
									name="position"
									type="number"
									defaultValue={
										editingPage?.position ??
										filteredPages.length
									}
									required
								/>
							</div>
						</div>

						{/* SEO Section */}
						<div className="grid gap-4">
							<h4 className="text-sm font-medium text-slate-900 border-b pb-2 mt-2">
								SEO Metadata
							</h4>

							<div className="grid gap-2">
								<Label htmlFor="seoTitle">Meta Title</Label>
								<Input
									id="seoTitle"
									name="seoTitle"
									defaultValue={editingPage?.seoMeta?.title}
									placeholder="Page title for search engines"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="seoKeywords">
									Keywords (comma separated)
								</Label>
								<Input
									id="seoKeywords"
									name="seoKeywords"
									defaultValue={editingPage?.seoMeta?.keywords?.join(
										", ",
									)}
									placeholder="e.g. governance, management, leadership"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="seoDescription">
									Meta Description
								</Label>
								<Textarea
									id="seoDescription"
									name="seoDescription"
									defaultValue={
										editingPage?.seoMeta?.description
									}
									placeholder="Brief description for search results..."
									rows={3}
								/>
							</div>
						</div>

						<DialogFooter className="mt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsAddOpen(false);
									setEditingPage(null);
								}}
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
									: editingPage
										? "Save Changes"
										: "Create Page"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* --- Delete Confirmation Dialog --- */}
			<AlertDialog
				open={deletePageId !== null}
				onOpenChange={(open) => !open && setDeletePageId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete the page and all its content from your
							website.
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
		</div>
	);
}
