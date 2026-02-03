import { Button } from "@/components/ui/button";
import SectionCard from "../components/SectionCard";
import { createSection } from "../api/sections.api";

export default function SectionList({ sections, pageId }: any) {
	return (
		<div className="space-y-6">
			{sections.map((section: any) => (
				<SectionCard key={section.id} section={section} />
			))}

			<Button onClick={() => createSection(pageId)}>+ Add Section</Button>
		</div>
	);
}
