import type React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { BlockType, ContentBlock } from "@/types/ContentBlocks.types";
import type { PageSection } from "@/types/PageSection.types";
import MembersBlockEditor from "./MembersBlockEditor";
import type { BlockFormState } from "./types";

interface ContentBlockFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingBlock: ContentBlock | null;
	activeSection: PageSection | null;
	formState: BlockFormState;
	setFormState: React.Dispatch<React.SetStateAction<BlockFormState>>;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	blockTypeOptions: BlockType[];
	isSubmitting: boolean;
}

export default function ContentBlockFormDialog({
	open,
	onOpenChange,
	editingBlock,
	activeSection,
	formState,
	setFormState,
	onSubmit,
	blockTypeOptions,
	isSubmitting,
}: ContentBlockFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={`bg-white flex flex-col max-h-[90vh] ${formState.blockType === "members" ? "sm:max-w-2xl" : "sm:max-w-150"}`}>
				<DialogHeader className="shrink-0">
					<DialogTitle>
						{editingBlock ? "Edit Block" : "Create Block"}
					</DialogTitle>
					<DialogDescription>
						{activeSection
							? `Section: ${activeSection.title || activeSection.id}`
							: "Add a new block to this section."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
				<div className="flex-1 overflow-y-auto px-1 py-4 grid gap-6 content-start">
					<div className="grid gap-3">
						<Label htmlFor="blockType">Block Type</Label>
						<Select
							value={formState.blockType}
							onValueChange={(value) =>
								setFormState((prev) => ({
									...prev,
									blockType: value as BlockType,
								}))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								{blockTypeOptions.map((type) => (
									<SelectItem key={type} value={type}>
										{type === "members" ? "Members List" : type.toUpperCase()}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-3">
						<Label htmlFor="blockPosition">Position</Label>
						<Input
							id="blockPosition"
							type="number"
							value={formState.position}
							onChange={(e) =>
								setFormState((prev) => ({
									...prev,
									position: Number(e.target.value),
								}))
							}
						/>
					</div>

					<div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
						<div>
							<p className="text-sm font-medium text-slate-900">
								Visibility
							</p>
							<p className="text-xs text-slate-500">
								Show this block on the public page.
							</p>
						</div>
						<Switch
							checked={formState.isVisible}
							onCheckedChange={(checked) =>
								setFormState((prev) => ({
									...prev,
									isVisible: checked,
								}))
							}
						/>
					</div>

					{formState.blockType === "text" ? (
						<div className="grid gap-3">
							<Label htmlFor="blockText">Text</Label>
							<Textarea
								id="blockText"
								value={formState.textValue}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										textValue: e.target.value,
									}))
								}
								placeholder="Enter text content"
								rows={6}
								className="max-h-56 resize-y overflow-auto break-words"
							/>
						</div>
					) : null}

					{formState.blockType === "image" ? (
						<div className="grid gap-3">
							<Label htmlFor="blockImageUrl">Image URL</Label>
							<Input
								id="blockImageUrl"
								type="url"
								value={formState.imageUrl}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										imageUrl: e.target.value,
									}))
								}
								placeholder="https://example.com/image.jpg"
							/>
							<Label htmlFor="blockImageAlt">
								Alt text (optional)
							</Label>
							<Input
								id="blockImageAlt"
								value={formState.imageAlt}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										imageAlt: e.target.value,
									}))
								}
								placeholder="Describe the image"
							/>
						</div>
					) : null}

					{formState.blockType === "list" ? (
						<div className="grid gap-3">
							<Label htmlFor="blockListItems">
								List items (one per line)
							</Label>
							<Textarea
								id="blockListItems"
								value={formState.listItems}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										listItems: e.target.value,
									}))
								}
								placeholder="First item\nSecond item"
								rows={6}
								className="max-h-56 resize-y overflow-auto break-words"
							/>
						</div>
					) : null}

					{formState.blockType === "html" ? (
						<div className="grid gap-3">
							<Label htmlFor="blockHtml">HTML</Label>
							<Textarea
								id="blockHtml"
								value={formState.htmlValue}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										htmlValue: e.target.value,
									}))
								}
								placeholder="<p>Your HTML here</p>"
								rows={6}
								className="max-h-56 resize-y overflow-auto break-words font-mono"
							/>
						</div>
					) : null}

					{formState.blockType === "members" ? (
						<div className="grid gap-3">
							<Label>Members</Label>
							<MembersBlockEditor
								members={formState.membersValue}
								onChange={(members) =>
									setFormState((prev) => ({
										...prev,
										membersValue: members,
									}))
								}
							/>
						</div>
					) : null}

				</div>

				<DialogFooter className="shrink-0 border-t border-slate-100 pt-4 mt-0">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-indigo-600 hover:bg-indigo-700"
							disabled={isSubmitting}
						>
							{isSubmitting
								? "Saving..."
								: editingBlock
									? "Save Changes"
									: "Create Block"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
