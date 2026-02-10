import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Status } from "@/types/Common.types";
import {
	ChevronDown,
	ChevronRight,
	FileText,
	Pencil,
	Trash2,
} from "lucide-react";
import { Button } from "../ui/button";

export interface SeoMeta {
	title: string;
	keywords: string[];
	description: string;
}

export interface PageRowData {
	id: number;
	menuId?: number | null;
	parentId?: number | null;
	title: string;
	slug: string;
	position: number;
	status: Status;
	seoMeta?: SeoMeta | null;
}

// --- Page Row Component ---
interface PageRowProps {
	page: PageRowData;
	onEdit: (page: PageRowData) => void;
	onDelete: (id: number) => void;
	level?: number;
	hasChildren?: boolean;
	isExpanded?: boolean;
	onToggle?: () => void;
}

function PageRow({
	page,
	onEdit,
	onDelete,
	level = 0,
	hasChildren = false,
	isExpanded = false,
	onToggle,
}: PageRowProps) {
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
			className={cn(
				"grid grid-cols-12 gap-4 items-center p-4 bg-white hover:bg-slate-50 transition-colors group border-b border-slate-100",
				level > 0 && "bg-slate-50/40",
			)}
		>
			<div
				className={cn(
					"col-span-5 flex items-center gap-3",
					level > 0 && "pl-6",
				)}
			>
				{hasChildren ? (
					<Button
						variant="ghost"
						size="icon"
						onClick={onToggle}
						className="h-7 w-7 text-slate-500 hover:text-slate-800"
						title={isExpanded ? "Collapse" : "Expand"}
					>
						{isExpanded ? (
							<ChevronDown size={16} />
						) : (
							<ChevronRight size={16} />
						)}
					</Button>
				) : (
					<span className="h-7 w-7" />
				)}
				<div className="flex items-center gap-2 min-w-0">
					<FileText size={14} className="text-slate-400" />
					<div className="min-w-0">
						<div className="font-medium text-slate-900 truncate">
							{page.title}
						</div>
						<div className="text-xs text-slate-500 truncate">
							/{page.slug}
						</div>
					</div>
				</div>
			</div>

			<div className="col-span-2 text-slate-500 text-sm font-mono">
				#{page.id}
			</div>

			<div className="col-span-2 text-slate-500 text-sm">
				Menu {page.menuId ?? "-"}
			</div>

			<div className="col-span-1 text-slate-500 text-sm">
				Pos {page.position}
			</div>

			<div className="col-span-1 flex justify-center">
				<Badge
					className={cn(
						"font-normal capitalize",
						getStatusClassName(page.status),
					)}
				>
					{page.status}
				</Badge>
			</div>

			<div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

export default PageRow;
