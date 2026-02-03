import { Badge } from "@/components/ui/badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface MenuData {
	id: number;
	name: string;
	slug: string;
	position: number;
	isActive: boolean;
}

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

export default SortableRow;