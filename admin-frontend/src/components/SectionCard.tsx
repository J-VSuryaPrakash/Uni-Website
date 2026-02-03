import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import BlockList from "./BlockList";
import { updateSection, deleteSection } from "../api/sections.api";
import { Button } from "@/components/ui/button";

export default function SectionCard({ section }: any) {
	const [title, setTitle] = useState(section.title ?? "");

	return (
		<Card className="p-4 space-y-4">
			<div className="flex gap-3">
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onBlur={() => updateSection(section.id, { title })}
				/>

				<Button
					variant="destructive"
					onClick={() => deleteSection(section.id)}
				>
					Delete
				</Button>
			</div>

			<BlockList blocks={section.contentBlocks} sectionId={section.id} />
		</Card>
	);
}
