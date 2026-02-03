import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Page } from "../types/Page.types";
import PageTreeItem from "./PageTreeItem";

interface Props {
    page: Page;
    level: number;
    onDelete: (id: number) => void;
    onUpdate: (id: number, data: any) => void;
    onReorder: (payload: { id: number; position: number }[]) => void;
}

export default function SortablePageItem(props: Props) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.page.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<PageTreeItem {...props} />
		</div>
	);
}
