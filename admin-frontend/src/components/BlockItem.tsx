import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateBlock, deleteBlock } from "../api/contentBlocks.api"
import { useState } from "react";

export default function BlockItem({ block }: any) {
	const [content, setContent] = useState(block.content?.text ?? "");

	return (
		<div className="border p-3 rounded space-y-2">
			{block.blockType === "text" && (
				<Textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onBlur={() =>
						updateBlock(block.id, {
							content: { text: content },
						})
					}
				/>
			)}

			<Button
				size="sm"
				variant="destructive"
				onClick={() => deleteBlock(block.id)}
			>
				Delete
			</Button>
		</div>
	);
}
