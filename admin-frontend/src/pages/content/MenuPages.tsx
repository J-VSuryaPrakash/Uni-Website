import {
	ArrowRight,
	ChevronDown,
	ChevronRight,
	ExternalLink,
	FileText,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import type { PageRowData } from "@/components/Pages/SortableRow";
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
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMenus } from "@/hooks/useMenus";
import { usePages } from "@/hooks/usePage";
import { cn } from "@/lib/utils";
import type { Status } from "@/types/Common.types";

interface PageFormState {
	title: string;
	slug: string;
	externalUrl: string;
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

function PageTreeRow({
	page,
	menuId,
	onEdit,
	onDelete,
	level = 0,
	hasChildren = false,
	isExpanded = false,
	onToggle,
}: {
	page: PageRowData;
	menuId: number;
	onEdit: (page: PageRowData) => void;
	onDelete: (id: number) => void;
	level?: number;
	hasChildren?: boolean;
	isExpanded?: boolean;
	onToggle?: () => void;
}) {
	const statusClass = {
		published:
			"bg-emerald-100 text-emerald-700 border-transparent shadow-none",
		draft: "bg-amber-100 text-amber-700 border-transparent shadow-none",
		archived:
			"bg-slate-100 text-slate-400 border-transparent shadow-none",
	}[page.status] ?? "bg-slate-100 text-slate-500 border-transparent shadow-none";

	return (
		<div
			className={cn(
				"flex items-center gap-3 px-4 py-2.5 bg-white border-b border-slate-100 hover:bg-slate-50/60 transition-colors group",
				level > 0 && "bg-slate-50/30",
			)}
			style={
				level > 0
					? { paddingLeft: `${16 + level * 20}px` }
					: undefined
			}
		>
			{/* Expand toggle */}
			{hasChildren ? (
				<button
					onClick={onToggle}
					className="p-0.5 rounded text-slate-400 hover:text-slate-600 shrink-0"
				>
					{isExpanded ? (
						<ChevronDown size={14} />
					) : (
						<ChevronRight size={14} />
					)}
				</button>
			) : (
				<span className="w-4 shrink-0" />
			)}

			{/* Icon + Title */}
			<div className="flex items-center gap-2 flex-1 min-w-0">
				<FileText size={13} className="text-slate-300 shrink-0" />
				<div className="min-w-0">
					<span className="text-sm font-medium text-slate-900 truncate block">
						{page.title}
					</span>
					<span className="text-xs text-slate-400 font-mono">
						/{page.slug}
					</span>
				</div>
			</div>

			{/* Status badge */}
			<Badge className={cn("text-xs font-normal shrink-0", statusClass)}>
				{page.status}
			</Badge>

			{/* Edit / Delete — shown on hover */}
			<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEdit(page)}
					className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
					title="Edit page"
				>
					<Pencil size={14} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(page.id)}
					className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
					title="Delete page"
				>
					<Trash2 size={14} />
				</Button>
			</div>

			{/* Navigate to sections */}
			<Link
				to={`/content/${menuId}/${page.id}`}
				className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-800 shrink-0 transition-colors"
			>
				Sections <ArrowRight size={12} />
			</Link>
		</div>
	);
}

export default function MenuPages() {
	const { menuId: menuIdStr } = useParams<{ menuId: string }>();
	const menuId = Number(menuIdStr);

	const { data: menus } = useMenus();
	const { data: pages, create, update, remove, reorder } = usePages();

	const currentMenu = useMemo(
		() => menus?.find((m) => m.id === menuId) ?? null,
		[menus, menuId],
	);

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
		externalUrl: "",
		menuId,
		parentId: null,
		position: 0,
		status: "published",
		seoTitle: "",
		seoKeywords: "",
		seoDescription: "",
	});

	// Pages belonging to this menu
	const menuPages = useMemo(() => {
		if (!pages) return [];
		return pages
			.filter((p) => p.menuId === menuId)
			.sort((a, b) => a.position - b.position);
	}, [pages, menuId]);

	const isSearchActive = searchQuery.trim().length > 0;
	const searchValue = searchQuery.trim().toLowerCase();
	const matchesQuery = (page: PageRowData) =>
		page.title.toLowerCase().includes(searchValue) ||
		page.slug.toLowerCase().includes(searchValue);

	// Build hierarchical tree from menuPages
	const treeRoots = useMemo(() => {
		const buildNodes = (parentId: number | null): PageNode[] => {
			const items = menuPages.filter((p) =>
				parentId === null
					? p.parentId === null || p.parentId === undefined
					: p.parentId === parentId,
			);
			return items.map((page) => ({
				page,
				children: buildNodes(page.id),
			}));
		};
		return buildNodes(null);
	}, [menuPages]);

	const visibleRoots = useMemo(() => {
		if (!isSearchActive) return treeRoots;
		const filterTree = (node: PageNode): PageNode | null => {
			const filteredChildren = node.children
				.map(filterTree)
				.filter((c): c is PageNode => c !== null);
			if (matchesQuery(node.page) || filteredChildren.length > 0) {
				return { page: node.page, children: filteredChildren };
			}
			return null;
		};
		return treeRoots
			.map(filterTree)
			.filter((n): n is PageNode => n !== null);
	}, [treeRoots, isSearchActive, searchValue]);

	const buildFormState = (page?: PageRowData | null): PageFormState => ({
		title: page?.title ?? "",
		slug: page?.slug ?? "",
		externalUrl: page?.externalUrl ?? "",
		menuId: page?.menuId ?? menuId,
		parentId: page?.parentId ?? null,
		position: page?.position ?? menuPages.length,
		status: page?.status ?? "published",
		seoTitle: page?.seoMeta?.title ?? "",
		seoKeywords: page?.seoMeta?.keywords?.join(", ") ?? "",
		seoDescription: page?.seoMeta?.description ?? "",
	});

	const clampPosition = (value: number, max: number) =>
		Number.isNaN(value) ? 0 : Math.max(0, Math.min(value, max));

	const buildReorderPayload = (
		allPages: PageRowData[],
		target: PageRowData,
		newPos: number,
		isNew: boolean,
	) => {
		const list = [...allPages].sort((a, b) => a.position - b.position);
		const filtered = isNew
			? list
			: list.filter((p) => p.id !== target.id);
		const clamped = clampPosition(newPos, filtered.length);
		filtered.splice(clamped, 0, target);
		return filtered.map((p, i) => ({ id: p.id, position: i }));
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const keywordsArray = formState.seoKeywords
			.split(",")
			.map((k) => k.trim())
			.filter(Boolean);
		const data = {
			title: formState.title,
			slug: formState.slug,
			externalUrl: formState.externalUrl.trim() || null,
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
			const prevPos = editingPage.position;
			update.mutate(
				{ id: editingPage.id, data },
				{
					onSuccess: (updated) => {
						toast.success("Page updated");
						if (pages && formState.position !== prevPos) {
							reorder.mutate(
								buildReorderPayload(
									pages,
									updated,
									formState.position,
									false,
								),
								{
									onError: (e: any) =>
										toast.error(
											e?.message ||
												"Failed to update positions",
										),
								},
							);
						}
						setEditingPage(null);
					},
					onError: (e: any) =>
						toast.error(e?.message || "Failed to update page"),
				},
			);
		} else {
			create.mutate(data, {
				onSuccess: (created) => {
					toast.success("Page created");
					if (pages && formState.position < pages.length) {
						reorder.mutate(
							buildReorderPayload(
								pages,
								created,
								formState.position,
								true,
							),
							{
								onError: (e: any) =>
									toast.error(
										e?.message ||
											"Failed to update positions",
									),
							},
						);
					}
					setIsAddOpen(false);
				},
				onError: (e: any) =>
					toast.error(e?.message || "Failed to create page"),
			});
		}
	};

	const handleDeleteConfirm = () => {
		if (deletePageId === null) return;
		remove.mutate(deletePageId, {
			onSuccess: () => {
				toast.success("Page deleted");
				setDeletePageId(null);
			},
			onError: (e: any) =>
				toast.error(e?.message || "Failed to delete page"),
		});
	};

	const openCreate = () => {
		setEditingPage(null);
		setFormState(buildFormState(null));
		setIsAddOpen(true);
	};

	const openEdit = (page: PageRowData) => {
		setEditingPage(page);
		setFormState(buildFormState(page));
	};

	// Parent options: only pages in this menu (excluding current editing page)
	const parentOptions = useMemo(
		() => menuPages.filter((p) => p.id !== editingPage?.id),
		[menuPages, editingPage],
	);

	const renderNodes = (
		nodes: PageNode[],
		level = 0,
	): React.ReactNode => {
		return nodes.map((node) => {
			const isExpanded =
				isSearchActive || expandedParents.has(node.page.id);
			const hasChildren = node.children.length > 0;
			return (
				<div key={node.page.id}>
					<PageTreeRow
						page={node.page}
						menuId={menuId}
						level={level}
						onEdit={openEdit}
						onDelete={setDeletePageId}
						hasChildren={hasChildren}
						isExpanded={isExpanded}
						onToggle={() =>
							setExpandedParents((prev) => {
								const next = new Set(prev);
								if (next.has(node.page.id))
									next.delete(node.page.id);
								else next.add(node.page.id);
								return next;
							})
						}
					/>
					{hasChildren && isExpanded
						? renderNodes(node.children, level + 1)
						: null}
				</div>
			);
		});
	};

	return (
		<>
			<div className="mx-auto w-full max-w-4xl space-y-5">
				{/* Breadcrumb */}
				<Breadcrumb
					items={[
						{ label: "Content", to: "/content" },
						{
							label:
								currentMenu?.name ?? `Menu #${menuId}`,
						},
					]}
				/>

				{/* Header */}
				<div className="flex items-end justify-between gap-4">
					<div>
						<h1 className="text-xl font-semibold text-slate-900">
							{currentMenu?.name ?? "Pages"}
						</h1>
						<p className="mt-0.5 text-sm text-slate-500">
							{menuPages.length} page
							{menuPages.length !== 1 ? "s" : ""} — click a page
							to manage its sections.
						</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<div className="relative">
							<Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
							<Input
								placeholder="Search pages..."
								value={searchQuery}
								onChange={(e) =>
									setSearchQuery(e.target.value)
								}
								className="h-8 w-48 pl-8 text-sm bg-white border-slate-200"
							/>
						</div>
						<Button
							onClick={openCreate}
							size="sm"
							className="h-8 bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
						>
							<Plus size={14} /> New Page
						</Button>
					</div>
				</div>

				{/* Table */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					{/* Column header */}
					<div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
						<span className="w-4 shrink-0" />
						<span className="flex-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
							Page
						</span>
						<span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-20 text-center">
							Status
						</span>
						<span className="w-16 shrink-0" />
						<span className="w-20 shrink-0" />
					</div>

					{/* Rows */}
					{menuPages.length === 0 && !searchQuery ? (
						<div className="py-16 text-center">
							<p className="text-sm text-slate-400">
								No pages in this menu yet.
							</p>
							<Button
								onClick={openCreate}
								size="sm"
								variant="outline"
								className="mt-3 gap-1.5"
							>
								<Plus size={14} /> Add First Page
							</Button>
						</div>
					) : visibleRoots.length > 0 ? (
						renderNodes(visibleRoots)
					) : (
						<div className="py-16 text-center text-sm text-slate-400">
							No pages match your search.
						</div>
					)}
				</div>
			</div>

			{/* Create / Edit Dialog */}
			<Dialog
				open={isAddOpen || !!editingPage}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingPage(null);
					}
				}}
			>
				<DialogContent className="sm:max-w-xl bg-white max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingPage ? "Edit Page" : "New Page"}
						</DialogTitle>
						<DialogDescription>
							{editingPage
								? "Update page details and settings."
								: `Creating a page in "${currentMenu?.name ?? "this menu"}".`}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSave} className="grid gap-4 py-2">
						{/* Title + Slug */}
						<div className="grid grid-cols-2 gap-3">
							<div className="grid gap-1.5">
								<Label htmlFor="title">Title *</Label>
								<Input
									id="title"
									value={formState.title}
									onChange={(e) =>
										setFormState((p) => ({
											...p,
											title: e.target.value,
										}))
									}
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="slug">Slug</Label>
								<Input
									id="slug"
									value={formState.slug}
									onChange={(e) =>
										setFormState((p) => ({
											...p,
											slug: e.target.value,
										}))
									}
									placeholder="auto-generated"
								/>
							</div>
						</div>

						{/* External Link */}
						<div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
							<div className="flex items-center gap-2">
								<ExternalLink size={14} className="text-slate-400" />
								<div>
									<p className="text-sm font-medium text-slate-900">External Link</p>
									<p className="text-xs text-slate-500">Opens an external URL instead of a page.</p>
								</div>
							</div>
							<Switch
								checked={!!formState.externalUrl}
								onCheckedChange={(checked) =>
									setFormState((p) => ({
										...p,
										externalUrl: checked ? p.externalUrl || "https://" : "",
									}))
								}
							/>
						</div>
						{formState.externalUrl !== "" && (
							<div className="grid gap-1.5">
								<Label htmlFor="externalUrl">External URL</Label>
								<Input
									id="externalUrl"
									type="url"
									value={formState.externalUrl}
									onChange={(e) =>
										setFormState((p) => ({
											...p,
											externalUrl: e.target.value,
										}))
									}
									placeholder="https://example.com/results"
								/>
							</div>
						)}

						{/* Menu + Parent + Status */}
						<div className="grid grid-cols-3 gap-3">
							<div className="grid gap-1.5">
								<Label>Menu</Label>
								<Select
									value={
										formState.menuId !== null
											? String(formState.menuId)
											: "none"
									}
									onValueChange={(v) =>
										setFormState((p) => ({
											...p,
											menuId: v === "none" ? null : Number(v),
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="No menu" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">
											No menu
										</SelectItem>
										{(menus ?? []).map((m) => (
											<SelectItem
												key={m.id}
												value={String(m.id)}
											>
												{m.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-1.5">
								<Label>Parent Page</Label>
								<Select
									value={
										formState.parentId === null
											? "none"
											: String(formState.parentId)
									}
									onValueChange={(v) =>
										setFormState((p) => ({
											...p,
											parentId:
												v === "none" ? null : Number(v),
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="None" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">
											None (top level)
										</SelectItem>
										{parentOptions.map((p) => (
											<SelectItem
												key={p.id}
												value={String(p.id)}
											>
												{p.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-1.5">
								<Label>Status</Label>
								<Select
									value={formState.status}
									onValueChange={(v) =>
										setFormState((p) => ({
											...p,
											status: v as Status,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue />
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

						{/* Position */}
						<div className="grid gap-1.5">
							<Label htmlFor="position">Position</Label>
							<Input
								id="position"
								type="number"
								value={formState.position}
								onChange={(e) =>
									setFormState((p) => ({
										...p,
										position: Number(e.target.value),
									}))
								}
								className="w-24"
							/>
						</div>

						{/* SEO */}
						<div className="border-t border-slate-100 pt-3">
							<p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
								SEO Metadata
							</p>
							<div className="grid gap-3">
								<div className="grid gap-1.5">
									<Label htmlFor="seoTitle">
										Meta Title
									</Label>
									<Input
										id="seoTitle"
										value={formState.seoTitle}
										onChange={(e) =>
											setFormState((p) => ({
												...p,
												seoTitle: e.target.value,
											}))
										}
										placeholder="Title for search engines"
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor="seoKeywords">
										Keywords
									</Label>
									<Input
										id="seoKeywords"
										value={formState.seoKeywords}
										onChange={(e) =>
											setFormState((p) => ({
												...p,
												seoKeywords: e.target.value,
											}))
										}
										placeholder="keyword1, keyword2"
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor="seoDesc">
										Meta Description
									</Label>
									<Textarea
										id="seoDesc"
										value={formState.seoDescription}
										onChange={(e) =>
											setFormState((p) => ({
												...p,
												seoDescription: e.target.value,
											}))
										}
										placeholder="Brief description for search results..."
										rows={2}
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
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
								className="bg-slate-900 hover:bg-slate-800"
								disabled={
									create.isPending || update.isPending
								}
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

			{/* Delete Confirmation */}
			<AlertDialog
				open={deletePageId !== null}
				onOpenChange={(open) => !open && setDeletePageId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this page?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the page and all its
							sections and content blocks.
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
		</>
	);
}
