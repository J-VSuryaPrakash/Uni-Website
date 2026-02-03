import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Page } from "../../types/Page.types";

interface Props {
	initial?: Partial<Page>;
	onSubmit: (data: any) => void;
}

export default function PageForm({ initial, onSubmit }: Props) {
	const [title, setTitle] = useState(initial?.title ?? "");
	const [slug, setSlug] = useState(initial?.slug ?? "");
	const [published, setPublished] = useState(initial?.status === "published");

	return (
		<div className="space-y-4">
			<Input
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			<Input
				placeholder="Slug"
				value={slug}
				onChange={(e) => setSlug(e.target.value)}
			/>

			<div className="flex items-center justify-between">
				<span>Status</span>
				<Switch checked={published} onCheckedChange={setPublished} />
			</div>

			<Button
				className="w-full"
				onClick={() =>
					onSubmit({
						title,
						slug,
						status: published ? "published" : "draft",
					})
				}
			>
				Save
			</Button>
		</div>
	);
}
