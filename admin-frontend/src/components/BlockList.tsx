import { Button } from "@/components/ui/button";
import BlockItem from "./BlockItem";
import { createBlock } from "../api/contentBlocks.api";

export default function BlockList({ blocks, sectionId }: any) {
	return (
		<div className="space-y-2">
			{blocks.map((block: any) => (
				<BlockItem key={block.id} block={block} />
			))}

			<div className="flex gap-2">
				<Button onClick={() => createBlock(sectionId, "text")}>
					Text
				</Button>
				<Button onClick={() => createBlock(sectionId, "image")}>
					Image
				</Button>
				<Button onClick={() => createBlock(sectionId, "html")}>
					HTML
				</Button>
			</div>
		</div>
	);
}
