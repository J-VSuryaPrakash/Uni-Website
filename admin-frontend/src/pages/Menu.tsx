import { closestCenter, DndContext } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMenus } from "../hooks/useMenus";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MenuForm from "../components/forms/MenuForm";

interface MenuItemProps {
	menu: any;
	editingMenuId: number | null;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onUpdate: (data: any) => void;
	onCancel: () => void;
}

function MenuItemCard({
	menu,
	editingMenuId,
	onEdit,
	onDelete,
	onUpdate,
	onCancel,
}: MenuItemProps) {
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
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<Card className="p-4 flex justify-between items-center bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-out cursor-grab active:cursor-grabbing group">
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<button
						{...attributes}
						{...listeners}
						className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-md transition-all duration-150 flex-shrink-0 transform group-hover:scale-110"
						title="Drag to reorder"
					>
						<GripVertical size={20} />
					</button>
					<span className="text-slate-800 font-medium truncate">
						{menu.name}
					</span>
				</div>

				<div className="flex gap-2 flex-shrink-0">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onEdit(menu.id)}
						className="gap-2 bg-white hover:bg-blue-50 border-slate-300 text-slate-700 hover:text-blue-600 transform hover:scale-105 transition-all duration-150 active:scale-95"
					>
						<Edit2 size={16} />
						<span className="hidden sm:inline">Update</span>
					</Button>

					<Button
						variant="destructive"
						size="sm"
						onClick={() => onDelete(menu.id)}
						className="gap-2 transform hover:scale-105 transition-all duration-150 active:scale-95"
					>
						<Trash2 size={16} />
						<span className="hidden sm:inline">Delete</span>
					</Button>
				</div>
			</Card>

			{editingMenuId === menu.id && (
				<div className="mt-3 p-5 border border-slate-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
					<h3 className="text-sm font-semibold text-slate-700 mb-4">
						Edit Menu
					</h3>
					<MenuForm initial={menu} onSubmit={onUpdate} />
					<Button
						variant="outline"
						size="sm"
						onClick={onCancel}
						className="mt-3 bg-white hover:bg-slate-100 border-slate-300"
					>
						Cancel
					</Button>
				</div>
			)}
		</div>
	);
}

export default function Menus() {
	const {
		data: menus,
		isLoading,
		create,
		remove,
		update,
		reorder,
	} = useMenus();
	const [showForm, setShowForm] = useState(false);
	const [editingMenuId, setEditingMenuId] = useState<number | null>(null);

	if (isLoading)
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-slate-600 animate-pulse">Loading...</div>
			</div>
		);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = menus!.findIndex((m) => m.id === active.id);
		const newIndex = menus!.findIndex((m) => m.id === over.id);

		const updated = arrayMove(menus!, oldIndex, newIndex);

		reorder.mutate(updated.map((m, i) => ({ id: m.id, position: i })));
	};

	const handleUpdate = (data: any) => {
		update.mutate({
			id: editingMenuId,
			data,
		});
		setEditingMenuId(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">
							Menus
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Manage and organize your menus
						</p>
					</div>
					<Button
						onClick={() => setShowForm(true)}
						className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-150 active:scale-95 shadow-md hover:shadow-lg"
					>
						+ Add Menu
					</Button>
				</div>

				{showForm && (
					<div className="p-6 border border-slate-200 rounded-lg bg-white shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Create New Menu
						</h3>
						<MenuForm
							onSubmit={(data) => {
								create.mutate({
									...data,
									position: menus?.length ?? 0,
								});
								setShowForm(false);
							}}
						/>
						<Button
							variant="outline"
							onClick={() => setShowForm(false)}
							className="mt-3"
						>
							Cancel
						</Button>
					</div>
				)}

				{menus && menus.length > 0 ? (
					<DndContext
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={menus.map((m) => m.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-3">
								{menus.map((menu) => (
									<MenuItemCard
										key={menu.id}
										menu={menu}
										editingMenuId={editingMenuId}
										onEdit={setEditingMenuId}
										onDelete={(id) => remove.mutate(id)}
										onUpdate={handleUpdate}
										onCancel={() => setEditingMenuId(null)}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				) : (
					<div className="text-center py-12 bg-white rounded-lg border border-slate-200">
						<p className="text-slate-500">
							No menus yet. Create your first menu!
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
