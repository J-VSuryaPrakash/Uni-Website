import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PageForm from "./PageForm";
import type { Page } from "../../types/Page.types";

interface Props {
	page?: Page;
	onSave: (data: any) => void;
}

export default function EditPageDialog({ page, onSave }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm">{page ? "Edit" : "Add"}</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{page ? "Edit Page" : "Create Page"}
					</DialogTitle>
				</DialogHeader>

				<PageForm initial={page} onSubmit={onSave} />
			</DialogContent>
		</Dialog>
	);
}
