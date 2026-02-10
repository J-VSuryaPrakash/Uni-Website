import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentBlock } from "@/types/ContentBlocks.types";
import type { Page } from "@/types/Page.types";
import type { PageSection } from "@/types/PageSection.types";

interface ContentBlocksTableProps {
	isLoading: boolean;
	selectedSectionId: number | null;
	blocks: ContentBlock[];
	activePage: Page | null;
	activeSection: PageSection | null;
	onEdit: (block: ContentBlock) => void;
	onDelete: (id: number) => void;
}

export default function ContentBlocksTable({
	isLoading,
	selectedSectionId,
	blocks,
	activePage,
	activeSection,
	onEdit,
	onDelete,
}: ContentBlocksTableProps) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
			<div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
				<div className="col-span-4">Type</div>
				<div className="col-span-2">ID</div>
				<div className="col-span-2 text-center">Position</div>
				<div className="col-span-2 text-center">Visibility</div>
				<div className="col-span-2 text-right">Actions</div>
			</div>

			{isLoading ? (
				<div className="p-10 text-center text-slate-500">
					Loading blocks...
				</div>
			) : selectedSectionId ? (
				<div className="divide-y divide-slate-100">
					{blocks.length > 0 ? (
						blocks.map((block) => (
							<div
								key={block.id}
								className="grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-slate-50"
							>
								<div className="col-span-4">
									<div className="font-medium text-slate-900">
										{block.blockType.toUpperCase()}
									</div>
									{activePage && activeSection ? (
										<div className="text-xs text-slate-500 truncate">
											{activePage.title} ·{" "}
											{activeSection.title || "Section"}
										</div>
									) : null}
								</div>
								<div className="col-span-2 text-slate-500 text-sm font-mono">
									#{block.id}
								</div>
								<div className="col-span-2 text-center text-slate-500 text-sm">
									{block.position}
								</div>
								<div className="col-span-2 flex justify-center">
									<Badge
										className={
											block.isVisible
												? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent shadow-none"
												: "bg-slate-100 text-slate-500 hover:bg-slate-200 border-transparent shadow-none"
										}
									>
										{block.isVisible ? "Visible" : "Hidden"}
									</Badge>
								</div>
								<div className="col-span-2 flex justify-end gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => onEdit(block)}
										className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
										title="Edit block"
									>
										<Pencil size={16} />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => onDelete(block.id)}
										className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
										title="Delete block"
									>
										<Trash2 size={16} />
									</Button>
								</div>
							</div>
						))
					) : (
						<div className="p-10 text-center text-slate-500">
							No blocks found for this section.
						</div>
					)}
				</div>
			) : (
				<div className="p-10 text-center text-slate-500">
					Select a section to view its blocks.
				</div>
			)}
		</div>
	);
}
