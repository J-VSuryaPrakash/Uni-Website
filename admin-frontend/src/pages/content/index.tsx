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
	useSortable,
	arrayMove,
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
import { Link } from "react-router-dom";
import { toast } from "sonner";

import DeleteConfirmButton from "@/components/Menu/DeleteConfirmButton";
import MenuAddUpdateDialog from "@/components/Menu/MenuAddUpdateDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenus } from "@/hooks/useMenus";
import { usePages } from "@/hooks/usePage";
import { cn } from "@/lib/utils";

interface MenuRowData {
	id: number;
	name: string;
	slug: string;
	position: number;
	isActive: boolean;
}

function SortableMenuRow({
	menu,
	pageCount,
	onEdit,
	onDelete,
}: {
	menu: MenuRowData;
	pageCount: number;
	onEdit: (menu: MenuRowData) => void;
	onDelete: (id: number) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: menu.id });

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

			{/* Name + Slug */}
			<div className="flex-1 min-w-0">
				<Link
					to={`/content/${menu.id}`}
					className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors truncate block"
				>
					{menu.name}
				</Link>
				<span className="text-xs text-slate-400 font-mono">
					/{menu.slug}
				</span>
			</div>

			{/* Page count */}
			<span className="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1 shrink-0 font-medium">
				{pageCount} page{pageCount !== 1 ? "s" : ""}
			</span>

			{/* Status */}
			<Badge
				className={cn(
					"shrink-0 font-normal text-xs",
					menu.isActive
						? "bg-emerald-100 text-emerald-700 border-transparent shadow-none"
						: "bg-slate-100 text-slate-400 border-transparent shadow-none",
				)}
			>
				{menu.isActive ? "Active" : "Inactive"}
			</Badge>

			{/* Edit / Delete — visible on hover */}
			<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEdit(menu)}
					className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
					title="Edit menu"
				>
					<Pencil size={14} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(menu.id)}
					className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
					title="Delete menu"
				>
					<Trash2 size={14} />
				</Button>
			</div>

			{/* Navigate to pages */}
			<Link
				to={`/content/${menu.id}`}
				className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg px-3 py-1.5 transition-colors shrink-0"
			>
				Manage Pages <ArrowRight size={13} />
			</Link>
		</div>
	);
}

export default function ContentHub() {
	const { data: menus, isLoading, create, update, remove, reorder } =
		useMenus();
	const { data: pages } = usePages();

	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingMenu, setEditingMenu] = useState<MenuRowData | null>(null);
	const [deleteMenuId, setDeleteMenuId] = useState<number | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	const pageCountByMenu = useMemo(() => {
		const map = new Map<number, number>();
		for (const page of pages ?? []) {
			if (page.menuId != null) {
				map.set(page.menuId, (map.get(page.menuId) ?? 0) + 1);
			}
		}
		return map;
	}, [pages]);

	const sortedMenus = useMemo(() => {
		return (menus ?? []).slice().sort((a, b) => a.position - b.position);
	}, [menus]);

	const filteredMenus = useMemo(() => {
		if (!searchQuery.trim()) return sortedMenus;
		const q = searchQuery.toLowerCase();
		return sortedMenus.filter(
			(m) =>
				m.name.toLowerCase().includes(q) ||
				m.slug.toLowerCase().includes(q),
		);
	}, [sortedMenus, searchQuery]);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id || !menus) return;

		const oldIndex = menus.findIndex((m) => m.id === active.id);
		const newIndex = menus.findIndex((m) => m.id === over.id);
		const reordered = arrayMove(menus, oldIndex, newIndex);

		reorder.mutate(
			reordered.map((m, i) => ({ id: m.id, position: i })),
			{
				onSuccess: () => toast.success("Menus reordered"),
				onError: (e: any) =>
					toast.error(e?.message || "Failed to reorder menus"),
			},
		);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<span className="text-sm text-slate-400 animate-pulse">
					Loading...
				</span>
			</div>
		);
	}

	return (
		<>
			<div className="mx-auto w-full max-w-4xl space-y-5">
				{/* Header */}
				<div className="flex items-end justify-between gap-4">
					<div>
						<h1 className="text-xl font-semibold text-slate-900">
							Content Management
						</h1>
						<p className="mt-0.5 text-sm text-slate-500">
							Select a menu to manage its pages, sections, and
							content blocks.
						</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<div className="relative">
							<Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
							<Input
								placeholder="Search menus..."
								value={searchQuery}
								onChange={(e) =>
									setSearchQuery(e.target.value)
								}
								className="h-8 w-48 pl-8 text-sm bg-white border-slate-200"
							/>
						</div>
						<Button
							onClick={() => setIsAddOpen(true)}
							size="sm"
							className="h-8 bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
						>
							<Plus size={14} /> New Menu
						</Button>
					</div>
				</div>

				{/* Table */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					{/* Column header */}
					<div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
						<span className="w-6 shrink-0" />
						<span className="flex-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
							Menu
						</span>
						<span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-16 text-center">
							Pages
						</span>
						<span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-16 text-center">
							Status
						</span>
						<span className="w-16 shrink-0" />
						<span className="w-28 shrink-0" />
					</div>

					{/* Sortable rows */}
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={filteredMenus.map((m) => m.id)}
							strategy={verticalListSortingStrategy}
						>
							{filteredMenus.length > 0 ? (
								filteredMenus.map((menu) => (
									<SortableMenuRow
										key={menu.id}
										menu={menu}
										pageCount={
											pageCountByMenu.get(menu.id) ?? 0
										}
										onEdit={setEditingMenu}
										onDelete={setDeleteMenuId}
									/>
								))
							) : (
								<div className="py-16 text-center">
									<p className="text-sm text-slate-400">
										{searchQuery
											? "No menus match your search."
											: "No menus yet. Create your first menu to get started."}
									</p>
									{!searchQuery && (
										<Button
											onClick={() => setIsAddOpen(true)}
											size="sm"
											variant="outline"
											className="mt-3 gap-1.5"
										>
											<Plus size={14} /> Create First Menu
										</Button>
									)}
								</div>
							)}
						</SortableContext>
					</DndContext>
				</div>
			</div>

			<MenuAddUpdateDialog
				isOpen={isAddOpen || !!editingMenu}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingMenu(null);
					}
				}}
				editingMenu={editingMenu}
				filteredMenus={filteredMenus}
				create={create}
				update={update}
				onSuccess={() => {}}
			/>

			<DeleteConfirmButton
				isOpen={deleteMenuId !== null}
				onOpenChange={(open) => !open && setDeleteMenuId(null)}
				deleteMenuId={deleteMenuId}
				remove={remove}
				onSuccess={() => {}}
			/>
		</>
	);
}
