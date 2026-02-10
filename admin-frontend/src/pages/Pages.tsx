import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import PageRow, { type PageRowData } from "@/components/Pages/SortableRow";
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
import { Textarea } from "@/components/ui/textarea";
import type { Status } from "@/types/Common.types";
import { usePages } from "../hooks/usePage";

// --- Types ---
interface PageFormState {
	title: string;
	slug: string;
	menuId: number | null;
	parentId: number | null;
	position: number;
	status: Status;
	seoTitle: string;
	seoKeywords: string;
	seoDescription: string;
}

interface PageNode {
	page: PageRowData;
	children: PageNode[];
}

// --- Main Page Component ---
export default function Pages() {
	const { data: pages, create, update, remove, reorder } = usePages();

	// State
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingPage, setEditingPage] = useState<PageRowData | null>(null);
	const [deletePageId, setDeletePageId] = useState<number | null>(null);
	const [expandedParents, setExpandedParents] = useState<Set<number>>(
		new Set(),
	);
	const [formState, setFormState] = useState<PageFormState>({
		title: "",
		slug: "",
		menuId: null,
		parentId: null,
		position: 0,
		status: "published",
		seoTitle: "",
		seoKeywords: "",
		seoDescription: "",
	});

	const isLoading = !pages;
	const searchValue = searchQuery.trim().toLowerCase();
	const isSearchActive = searchValue.length > 0;

	const matchesQuery = (page: PageRowData) =>
		page.title.toLowerCase().includes(searchValue) ||
		page.slug.toLowerCase().includes(searchValue);

	const sortedPages = useMemo(() => {
		if (!pages) return [];
		return [...pages].sort((a, b) => a.position - b.position);
	}, [pages]);

	const treeRoots = useMemo(() => {
		const map = new Map<number, PageRowData[]>();
		for (const page of sortedPages) {
			if (page.parentId === null || page.parentId === undefined) continue;
			const list = map.get(page.parentId) ?? [];
			list.push(page);
			map.set(page.parentId, list);
		}

		const buildNodes = (parentId: number | null): PageNode[] => {
			const items =
				parentId === null
					? sortedPages.filter(
							(page) =>
								page.parentId === null ||
								page.parentId === undefined,
						)
					: (map.get(parentId) ?? []);
			return items.map((page) => ({
				page,
				children: buildNodes(page.id),
			}));
		};

		return buildNodes(null);
	}, [sortedPages]);

	const visibleTreeRoots = useMemo(() => {
		if (!isSearchActive) return treeRoots;
		const filterTree = (node: PageNode): PageNode | null => {
			const filteredChildren = node.children
				.map(filterTree)
				.filter((child): child is PageNode => child !== null);
			if (matchesQuery(node.page) || filteredChildren.length > 0) {
				return { page: node.page, children: filteredChildren };
			}
			return null;
		};

		return treeRoots
			.map(filterTree)
			.filter((node): node is PageNode => node !== null);
	}, [treeRoots, isSearchActive, searchValue]);

	const parentOptions = useMemo(() => {
		return sortedPages.filter((page) => page.id !== editingPage?.id);
	}, [sortedPages, editingPage]);

	const buildFormState = (page?: PageRowData | null): PageFormState => ({
		title: page?.title ?? "",
		slug: page?.slug ?? "",
		menuId: page?.menuId ?? null,
		parentId: page?.parentId ?? null,
		position: page?.position ?? sortedPages.length,
		status: page?.status ?? "published",
		seoTitle: page?.seoMeta?.title ?? "",
		seoKeywords: page?.seoMeta?.keywords?.join(", ") ?? "",
		seoDescription: page?.seoMeta?.description ?? "",
	});

	const clampPosition = (value: number, max: number) => {
		if (Number.isNaN(value)) return 0;
		return Math.max(0, Math.min(value, max));
	};

	const buildReorderPayload = (
		allPages: PageRowData[],
		targetPage: PageRowData,
		newPosition: number,
		isNewPage: boolean,
	) => {
		const list = [...allPages].sort((a, b) => a.position - b.position);
		const filtered = isNewPage
			? list
			: list.filter((page) => page.id !== targetPage.id);
		const clamped = clampPosition(newPosition, filtered.length);
		filtered.splice(clamped, 0, targetPage);
		return filtered.map((page, index) => ({
			id: page.id,
			position: index,
		}));
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const keywordsArray = formState.seoKeywords
			.split(",")
			.map((k) => k.trim())
			.filter((k) => k);

		const data = {
			title: formState.title,
			slug: formState.slug,
			menuId: formState.menuId ?? undefined,
			parentId: formState.parentId ?? null,
			position: formState.position,
			status: formState.status,
			seoMeta: {
				title: formState.seoTitle,
				description: formState.seoDescription,
				keywords: keywordsArray,
			},
		};

		if (editingPage) {
			const previousPosition = editingPage.position;
			update.mutate(
				{ id: editingPage.id, data },
				{
					onSuccess: (updatedPage) => {
						toast.success("Page updated successfully");
						if (pages && formState.position !== previousPosition) {
							const payload = buildReorderPayload(
								pages,
								updatedPage,
								formState.position,
								false,
							);
							reorder.mutate(payload, {
								onSuccess: () =>
									toast.success(
										"Positions updated successfully",
									),
								onError: (error: any) =>
									toast.error(
										error?.message ||
											"Failed to update positions",
									),
							});
						}
						setEditingPage(null);
					},
					onError: (error: any) => {
						toast.error(error?.message || "Failed to update page");
					},
				},
			);
		} else {
			create.mutate(data, {
				onSuccess: (createdPage) => {
					toast.success("Page created successfully");
					if (pages && formState.position < pages.length) {
						const payload = buildReorderPayload(
							pages,
							createdPage,
							formState.position,
							true,
						);
						reorder.mutate(payload, {
							onSuccess: () =>
								toast.success("Positions updated successfully"),
							onError: (error: any) =>
								toast.error(
									error?.message ||
										"Failed to update positions",
								),
						});
					}
					setIsAddOpen(false);
				},
				onError: (error: any) => {
					toast.error(error?.message || "Failed to create page");
				},
			});
		}
	};

	const openEdit = (page: PageRowData) => {
		setEditingPage(page);
		setFormState(buildFormState(page));
	};

	const openCreate = () => {
		setEditingPage(null);
		setFormState(buildFormState(null));
		setIsAddOpen(true);
	};

	const handleParentChange = (value: string) => {
		if (!pages) return;
		if (value === "none") {
			setFormState((prev) => ({
				...prev,
				parentId: null,
			}));
			return;
		}

		const parentId = Number(value);
		const parent = pages.find((page) => page.id === parentId);
		setFormState((prev) => ({
			...prev,
			parentId,
			menuId: parent?.menuId ?? prev.menuId,
		}));
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

	const renderNodes = (nodes: PageNode[], level = 0) => {
		return nodes.map((node) => {
			const isExpanded =
				isSearchActive || expandedParents.has(node.page.id);
			const hasChildren = node.children.length > 0;
			return (
				<div key={node.page.id}>
					<PageRow
						page={node.page}
						level={level}
						onEdit={openEdit}
						onDelete={setDeletePageId}
						hasChildren={hasChildren}
						isExpanded={isExpanded}
						onToggle={() => {
							setExpandedParents((prev) => {
								const next = new Set(prev);
								if (next.has(node.page.id)) {
									next.delete(node.page.id);
								} else {
									next.add(node.page.id);
								}
								return next;
							});
						}}
					/>
					{hasChildren && isExpanded ? (
						<div
							className={
								level === 0
									? "border-l border-slate-200 ml-6"
									: "border-l border-slate-200 ml-10"
							}
						>
							{renderNodes(node.children, level + 1)}
						</div>
					) : null}
				</div>
			);
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="text-slate-400 animate-pulse font-medium">
					Loading Pages...
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
			<div className="space-y-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900">
							Pages
						</h1>
						<p className="text-sm text-slate-500">
							Group pages by hierarchy and edit ordering from the
							panel.
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

				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
					<div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/80 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-5">Page</div>
						<div className="col-span-2">ID</div>
						<div className="col-span-2">Menu</div>
						<div className="col-span-1">Position</div>
						<div className="col-span-1 text-center">Status</div>
						<div className="col-span-1 text-right">Actions</div>
					</div>

					<div className="divide-y divide-slate-100">
						{visibleTreeRoots.length > 0 ? (
							renderNodes(visibleTreeRoots)
						) : (
							<div className="p-12 text-center text-slate-500">
								No pages found.
							</div>
						)}
					</div>
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
				<DialogContent className="sm:max-w-150 bg-white max-h-[90vh] overflow-y-auto">
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
										value={formState.title}
										onChange={(e) =>
											setFormState((prev) => ({
												...prev,
												title: e.target.value,
											}))
										}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										name="slug"
										value={formState.slug}
										onChange={(e) =>
											setFormState((prev) => ({
												...prev,
												slug: e.target.value,
											}))
										}
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
										value={formState.menuId ?? ""}
										onChange={(e) =>
											setFormState((prev) => ({
												...prev,
												menuId: e.target.value
													? Number(e.target.value)
													: null,
											}))
										}
										readOnly={formState.parentId !== null}
										className={
											formState.parentId !== null
												? "bg-slate-100 text-slate-500"
												: ""
										}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="parentId">Parent ID</Label>
									<Select
										value={
											formState.parentId === null
												? "none"
												: String(formState.parentId)
										}
										onValueChange={handleParentChange}
									>
										<SelectTrigger>
											<SelectValue placeholder="None" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">
												None
											</SelectItem>
											{parentOptions.map((page) => (
												<SelectItem
													key={page.id}
													value={String(page.id)}
												>
													{page.title} (#{page.id})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="status">Status</Label>
									<Select
										value={formState.status}
										onValueChange={(value) =>
											setFormState((prev) => ({
												...prev,
												status: value as Status,
											}))
										}
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
									value={formState.position}
									onChange={(e) =>
										setFormState((prev) => ({
											...prev,
											position: Number(e.target.value),
										}))
									}
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
									value={formState.seoTitle}
									onChange={(e) =>
										setFormState((prev) => ({
											...prev,
											seoTitle: e.target.value,
										}))
									}
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
									value={formState.seoKeywords}
									onChange={(e) =>
										setFormState((prev) => ({
											...prev,
											seoKeywords: e.target.value,
										}))
									}
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
									value={formState.seoDescription}
									onChange={(e) =>
										setFormState((prev) => ({
											...prev,
											seoDescription: e.target.value,
										}))
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
