import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
	initial?: any;
	onSubmit: (data: any) => void;
}

export default function MenuForm({ initial, onSubmit }: Props) {
	const [name, setName] = useState(initial?.name ?? "");
	const [slug, setSlug] = useState(initial?.slug ?? "");

	return (
		<div className="space-y-4">
			<Input
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<Input
				placeholder="Slug"
				value={slug}
				onChange={(e) => setSlug(e.target.value)}
			/>

			<Button onClick={() => onSubmit({ name, slug })}>Save</Button>
		</div>
	);
}
