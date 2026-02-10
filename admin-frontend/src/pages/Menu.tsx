import type { DragEndEvent } from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import DeleteConfirmButton from "@/components/Menu/DeleteConfirmButton";
import MenuAddUpdateDialog from "@/components/Menu/MenuAddUpdateDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMenus } from "../hooks/useMenus";

// --- Types ---
interface MenuData {
	id: number;
	name: string;
	slug: string;
	position: number;
	isActive: boolean;
}

// --- Sortable Row Component ---
interface SortableRowProps {
	menu: MenuData;
	onEdit: (menu: MenuData) => void;
	onDelete: (id: number) => void;
}

function SortableRow({ menu, onEdit, onDelete }: SortableRowProps) {
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
				"grid grid-cols-12 gap-4 items-center p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors group",
				isDragging &&
					"shadow-lg ring-1 ring-slate-200 rotate-1 bg-slate-50 opacity-90 rounded-md",
			)}
		>
			{/* Drag Handle */}
			<div className="col-span-1 flex justify-center">
				<button
					{...attributes}
					{...listeners}
					className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-grab active:cursor-grabbing transition-colors"
				>
					<GripVertical size={18} />
				</button>
			</div>

			{/* ID */}
			<div className="col-span-1 text-slate-500 text-sm font-mono">
				#{menu.id}
			</div>

			{/* Name */}
			<div className="col-span-3 font-medium text-slate-800 truncate">
				{menu.name}
			</div>

			{/* Slug */}
			<div className="col-span-3 text-slate-500 text-sm truncate bg-slate-100 px-2 py-1 rounded-md w-fit max-w-full">
				/{menu.slug}
			</div>

			{/* Position */}
			<div className="col-span-1 text-slate-500 text-sm text-center">
				{menu.position}
			</div>

			{/* Status */}
			<div className="col-span-1 flex justify-center">
				<Badge
					variant={menu.isActive ? "default" : "secondary"}
					className={cn(
						"font-normal",
						menu.isActive
							? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent shadow-none"
							: "bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-none",
					)}
				>
					{menu.isActive ? "Active" : "Inactive"}
				</Badge>
			</div>

			{/* Actions */}
			<div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEdit(menu)}
					className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
				>
					<Pencil size={16} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(menu.id)}
					className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
				>
					<Trash2 size={16} />
				</Button>
			</div>
		</div>
	);
}

// --- Main Page Component ---
export default function Menus() {
	const {
		data: menus,
		isLoading,
		create,
		remove,
		update,
		reorder,
	} = useMenus();

	// State
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingMenu, setEditingMenu] = useState<MenuData | null>(null);
	const [deleteMenuId, setDeleteMenuId] = useState<number | null>(null);

	// Dnd Sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	// Filtered Data
	const filteredMenus = useMemo(() => {
		if (!menus) return [];
		return menus.filter(
			(menu) =>
				menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				menu.slug.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [menus, searchQuery]);

	// Handlers
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id || !menus) return;

		const oldIndex = menus.findIndex((m) => m.id === active.id);
		const newIndex = menus.findIndex((m) => m.id === over.id);

		// Create the reordered array
		const reorderedMenus = arrayMove(menus, oldIndex, newIndex);

		// Map to the format expected by the API: array of {id, position}
		const reorderPayload = reorderedMenus.map((menu, index) => ({
			id: menu.id,
			position: index,
		}));

		// Send the reorder request
		reorder.mutate(reorderPayload, {
			onSuccess: () => {
				toast.success("Menus reordered successfully");
			},
			onError: (error: any) => {
				toast.error(error?.message || "Failed to reorder menus");
			},
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="text-slate-400 animate-pulse font-medium">
					Loading Menus...
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
				{/* Top Header Section */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900">
							Menus
						</h1>
						<p className="text-sm text-slate-500">
							Manage your application's navigation structure.
						</p>
					</div>

					<div className="flex items-center gap-3">
						{/* Search Bar */}
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search menus..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full sm:w-64 pl-9 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
							/>
						</div>

						{/* Add Button */}
						<Button
							onClick={() => setIsAddOpen(true)}
							className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all"
						>
							<Plus className="mr-2 h-4 w-4" /> Add Menu
						</Button>
					</div>
				</div>

				{/* Content Section */}
				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
					{/* Table Header */}
					<div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-1 text-center">Order</div>
						<div className="col-span-1">ID</div>
						<div className="col-span-3">Name</div>
						<div className="col-span-3">Slug</div>
						<div className="col-span-1 text-center">Pos</div>
						<div className="col-span-1 text-center">Status</div>
						<div className="col-span-2 text-right">Actions</div>
					</div>

					{/* Sortable List */}
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={filteredMenus.map((m) => m.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="divide-y divide-slate-100">
								{filteredMenus.length > 0 ? (
									filteredMenus.map((menu) => (
										<SortableRow
											key={menu.id}
											menu={menu}
											onEdit={setEditingMenu}
											onDelete={setDeleteMenuId}
										/>
									))
								) : (
									<div className="p-12 text-center text-slate-500">
										No menus found.
									</div>
								)}
							</div>
						</SortableContext>
					</DndContext>
				</div>
			</div>

			// {/* --- Add/Update Dialog Component --- */}
			// <MenuAddUpdateDialog
			// 	isOpen={isAddOpen || !!editingMenu}
			// 	onOpenChange={(open) => {
			// 		if (!open) {
			// 			setIsAddOpen(false);
			// 			setEditingMenu(null);
			// 		}
			// 	}}
			// 	editingMenu={editingMenu}
			// 	filteredMenus={filteredMenus}
			// 	create={create}
			// 	update={update}
			// 	onSuccess={() => {
			// 		// Success callbacks are handled in the component
			// 	}}
			// />

			// {/* --- Delete Confirmation Component --- */}
			// <DeleteConfirmButton
			// 	isOpen={deleteMenuId !== null}
			// 	onOpenChange={(open) => !open && setDeleteMenuId(null)}
			// 	deleteMenuId={deleteMenuId}
			// 	remove={remove}
			// 	onSuccess={() => {
			// 		// Success callback is handled in the component
			// 	}}
			// />
		
	);
}
