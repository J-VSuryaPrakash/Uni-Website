import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileText, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

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
	status: string; // e.g., "published", "draft", "archived"
	seoMeta: SeoMeta;
}

// --- Sortable Row Component ---
interface SortableRowProps {
	page: PageData;
	onEdit: (page: PageData) => void;
	onDelete: (id: number) => void;
}

function SortableRow({ page, onEdit, onDelete }: SortableRowProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: page.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : "auto",
		position: "relative" as const,
	};

	// Enhanced status badge with support for archived status
	const getStatusClassName = (status: string) => {
		switch (status.toLowerCase()) {
			case "published":
				return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent shadow-none";
			case "draft":
				return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-transparent shadow-none";
			case "archived":
				return "bg-slate-100 text-slate-500 hover:bg-slate-200 border-transparent shadow-none";
			default:
				return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent shadow-none";
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"grid grid-cols-13 gap-4 items-center p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors group",
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
				#{page.id}
			</div>

			{/* Title */}
			<div className="col-span-3 font-medium text-slate-800 truncate flex items-center gap-2">
				<FileText size={14} className="text-slate-400" />
				{page.title}
			</div>

			{/* Slug */}
			<div className="col-span-2 text-slate-500 text-sm truncate bg-slate-100 px-2 py-1 rounded-md w-fit max-w-full">
				/{page.slug}
			</div>

			{/* Parent ID (Optional visual) */}
			<div className="col-span-1 text-slate-400 text-sm text-center font-mono">
				{page.parentId ? `P:${page.parentId}` : "-"}
			</div>

			{/* MENU ID */}
			<div className="col-span-1 text-slate-400 text-sm text-center font-mono">
				{page.menuId ? `M:${page.menuId}` : "-"}
			</div>

			{/* Status */}
			<div className="col-span-2 flex justify-center">
				<Badge
					className={cn(
						"font-normal capitalize",
						getStatusClassName(page.status),
					)}
				>
					{page.status}
				</Badge>
			</div>

			{/* Actions */}
			<div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEdit(page)}
					className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
					title="Edit page"
				>
					<Pencil size={16} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(page.id)}
					className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
					title="Delete page"
				>
					<Trash2 size={16} />
				</Button>
			</div>
		</div>
	);
}

export default SortableRow;
