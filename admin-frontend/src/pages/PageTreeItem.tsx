import EditPageDialog from "@/components/forms/EditPageDialog";
import type { Page } from "../types/Page.types";
import { Button } from "@/components/ui/button";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";

import SortablePageItem from "./SortablePageItem";
  
interface Props {
	page: Page;
	level?: number;
	onDelete: (id: number) => void;
	onUpdate: (id: number, data: any) => void;
	onReorder: (payload: { id: number; position: number }[]) => void;
}
  

export default function PageTreeItem({ page, level = 0,onUpdate,
    onDelete,onReorder }: Props) {
	return (
		<div>
			<div
				className="flex items-center justify-between p-2 border rounded mb-1"
				style={{ paddingLeft: level * 20 }}
			>
				<span>{page.title}</span>

				<div className="space-x-2">
					<EditPageDialog
						page={page}
						onSave={(data) => onUpdate(page.id, data)}
					/>

					<Button
						size="sm"
						variant="destructive"
						onClick={() => onDelete(page.id)}
					>
						Delete
					</Button>
				</div>
			</div>

			{page.children && page.children.length > 0 && (
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={(event) => {
						const { active, over } = event;
						if (!over || active.id === over.id) return;

						const oldIndex = page.children!.findIndex(
							(p) => p.id === active.id,
						);
						const newIndex = page.children!.findIndex(
							(p) => p.id === over.id,
						);

						const reordered = arrayMove(
							page.children!,
							oldIndex,
							newIndex,
						);

					onReorder(
							reordered.map((p, i) => ({
								id: p.id,
								position: i,
							})),
						);
					}}
				>
					<SortableContext
						items={page.children.map((c) => c.id)}
						strategy={verticalListSortingStrategy}
					>
						{page.children.map((child) => (
							<SortablePageItem
								key={child.id}
								page={child}
								level={level + 1}
								onDelete={onDelete}
								onUpdate={onUpdate}
                                onReorder={onReorder}
							/>
						))}
					</SortableContext>
				</DndContext>
			)}
		</div>
	);
}
