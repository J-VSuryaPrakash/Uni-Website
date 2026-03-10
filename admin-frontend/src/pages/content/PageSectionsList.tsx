import type { DragEndEvent } from "@dnd-kit/core";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	ArrowRight,
	GripVertical,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/common/Breadcrumb";
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
import { useMenus } from "@/hooks/useMenus";
import { usePages } from "@/hooks/usePage";
import { usePageSections } from "@/hooks/usePageSections";
import { cn } from "@/lib/utils";
import type { PageSection } from "@/types/PageSection.types";

interface SectionFormState {
	title: string;
	position: number;
}

function SortableSectionRow({
	section,
	menuId,
	pageId,
	onEdit,
	onDelete,
}: {
	section: PageSection;
	menuId: number;
	pageId: number;
	onEdit: (section: PageSection) => void;
	onDelete: (id: number) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: section.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : "auto",
		position: "relative" as const,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 hover:bg-slate-50/60 transition-colors group",
				isDragging &&
					"shadow-md opacity-95 rounded-lg ring-1 ring-slate-200",
			)}
		>
			{/* Drag Handle */}
			<button
				{...attributes}
				{...listeners}
				className="p-1 rounded text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0 transition-colors"
				title="Drag to reorder"
			>
				<GripVertical size={16} />
			</button>

			{/* Title */}
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-slate-900 truncate block">
					{section.title || (
						<span className="text-slate-400 italic">
							Untitled section
						</span>
					)}
				</span>
				<span className="text-xs text-slate-400 font-mono">
					#{section.id} · position {section.position}
				</span>
			</div>

			{/* Edit / Delete */}
			<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEdit(section)}
					className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
					title="Edit section"
				>
					<Pencil size={14} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(section.id)}
					className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
					title="Delete section"
				>
					<Trash2 size={14} />
				</Button>
			</div>

			{/* Navigate to blocks */}
			<Link
				to={`/content/${menuId}/${pageId}/${section.id}`}
				className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-800 shrink-0 transition-colors"
			>
				Content Blocks <ArrowRight size={12} />
			</Link>
		</div>
	);
}

export default function PageSectionsList() {
	const { menuId: menuIdStr, pageId: pageIdStr } = useParams<{
		menuId: string;
		pageId: string;
	}>();
	const menuId = Number(menuIdStr);
	const pageId = Number(pageIdStr);

	const { data: menus } = useMenus();
	const { data: pages } = usePages();
	const { data: sections, isLoading, create, update, remove, reorder } =
		usePageSections(pageId);

	const currentMenu = useMemo(
		() => menus?.find((m) => m.id === menuId) ?? null,
		[menus, menuId],
	);
	const currentPage = useMemo(
		() => pages?.find((p) => p.id === pageId) ?? null,
		[pages, pageId],
	);

	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingSection, setEditingSection] =
		useState<PageSection | null>(null);
	const [deleteSectionId, setDeleteSectionId] = useState<number | null>(
		null,
	);
	const [formState, setFormState] = useState<SectionFormState>({
		title: "",
		position: 0,
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	const sortedSections = useMemo(() => {
		if (!sections) return [];
		return [...sections].sort((a, b) => a.position - b.position);
	}, [sections]);

	const filteredSections = useMemo(() => {
		if (!searchQuery.trim()) return sortedSections;
		const q = searchQuery.toLowerCase();
		return sortedSections.filter(
			(s) =>
				(s.title ?? "").toLowerCase().includes(q) ||
				String(s.id).includes(q),
		);
	}, [sortedSections, searchQuery]);

	const buildFormState = (section?: PageSection | null): SectionFormState => ({
		title: section?.title ?? "",
		position: section?.position ?? (sections?.length ?? 0),
	});

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id || !sections) return;

		const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
		const newIndex = sortedSections.findIndex((s) => s.id === over.id);
		const reordered = arrayMove(sortedSections, oldIndex, newIndex);

		reorder.mutate(
			reordered.map((s, i) => ({ id: s.id, position: i })),
			{
				onSuccess: () => toast.success("Sections reordered"),
				onError: (e: any) =>
					toast.error(e?.message || "Failed to reorder sections"),
			},
		);
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const payload = {
			title: formState.title.trim() || undefined,
			position: formState.position,
		};

		if (editingSection) {
			update.mutate(
				{ id: editingSection.id, data: payload },
				{
					onSuccess: () => {
						toast.success("Section updated");
						setEditingSection(null);
					},
					onError: (e: any) =>
						toast.error(e?.message || "Failed to update section"),
				},
			);
		} else {
			create.mutate(payload, {
				onSuccess: () => {
					toast.success("Section created");
					setIsAddOpen(false);
				},
				onError: (e: any) =>
					toast.error(e?.message || "Failed to create section"),
			});
		}
	};

	const handleDeleteConfirm = () => {
		if (deleteSectionId === null) return;
		remove.mutate(deleteSectionId, {
			onSuccess: () => {
				toast.success("Section deleted");
				setDeleteSectionId(null);
			},
			onError: (e: any) =>
				toast.error(e?.message || "Failed to delete section"),
		});
	};

	const openCreate = () => {
		setEditingSection(null);
		setFormState(buildFormState(null));
		setIsAddOpen(true);
	};

	const openEdit = (section: PageSection) => {
		setEditingSection(section);
		setFormState(buildFormState(section));
	};

	return (
		<>
			<div className="mx-auto w-full max-w-4xl space-y-5">
				{/* Breadcrumb */}
				<Breadcrumb
					items={[
						{ label: "Content", to: "/content" },
						{
							label: currentMenu?.name ?? `Menu #${menuId}`,
							to: `/content/${menuId}`,
						},
						{
							label:
								currentPage?.title ?? `Page #${pageId}`,
						},
					]}
				/>

				{/* Header */}
				<div className="flex items-end justify-between gap-4">
					<div>
						<h1 className="text-xl font-semibold text-slate-900">
							{currentPage?.title ?? "Sections"}
						</h1>
						<p className="mt-0.5 text-sm text-slate-500">
							{sortedSections.length} section
							{sortedSections.length !== 1 ? "s" : ""} — drag
							to reorder, click to manage content blocks.
						</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<div className="relative">
							<Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
							<Input
								placeholder="Search sections..."
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
							<Plus size={14} /> New Section
						</Button>
					</div>
				</div>

				{/* Table */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					{/* Column header */}
					<div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
						<span className="w-6 shrink-0" />
						<span className="flex-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
							Section
						</span>
						<span className="w-16 shrink-0" />
						<span className="w-28 shrink-0" />
					</div>

					{/* Rows */}
					{isLoading ? (
						<div className="py-12 text-center text-sm text-slate-400 animate-pulse">
							Loading sections...
						</div>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={filteredSections.map((s) => s.id)}
								strategy={verticalListSortingStrategy}
							>
								{filteredSections.length > 0 ? (
									filteredSections.map((section) => (
										<SortableSectionRow
											key={section.id}
											section={section}
											menuId={menuId}
											pageId={pageId}
											onEdit={openEdit}
											onDelete={setDeleteSectionId}
										/>
									))
								) : (
									<div className="py-16 text-center">
										<p className="text-sm text-slate-400">
											{searchQuery
												? "No sections match your search."
												: "No sections yet. Create one to start adding content."}
										</p>
										{!searchQuery && (
											<Button
												onClick={openCreate}
												size="sm"
												variant="outline"
												className="mt-3 gap-1.5"
											>
												<Plus size={14} /> Add First
												Section
											</Button>
										)}
									</div>
								)}
							</SortableContext>
						</DndContext>
					)}
				</div>
			</div>

			{/* Create / Edit Dialog */}
			<Dialog
				open={isAddOpen || !!editingSection}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingSection(null);
					}
				}}
			>
				<DialogContent className="sm:max-w-md bg-white">
					<DialogHeader>
						<DialogTitle>
							{editingSection ? "Edit Section" : "New Section"}
						</DialogTitle>
						<DialogDescription>
							{currentPage
								? `Page: ${currentPage.title}`
								: "Add a section to this page."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSave} className="grid gap-4 py-2">
						<div className="grid gap-1.5">
							<Label htmlFor="sectionTitle">Title</Label>
							<Input
								id="sectionTitle"
								value={formState.title}
								onChange={(e) =>
									setFormState((p) => ({
										...p,
										title: e.target.value,
									}))
								}
								placeholder="Section title (optional)"
							/>
						</div>

						<div className="grid gap-1.5">
							<Label htmlFor="sectionPosition">Position</Label>
							<Input
								id="sectionPosition"
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

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsAddOpen(false);
									setEditingSection(null);
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
									: editingSection
										? "Save Changes"
										: "Create Section"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<AlertDialog
				open={deleteSectionId !== null}
				onOpenChange={(open) => !open && setDeleteSectionId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Delete this section?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the section and all
							its content blocks.
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
