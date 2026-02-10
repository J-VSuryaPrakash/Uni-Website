import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ContentBlockDeleteDialog from "@/components/ContentBlocks/ContentBlockDeleteDialog";
import ContentBlockFormDialog from "@/components/ContentBlocks/ContentBlockFormDialog";
import ContentBlocksHeader from "@/components/ContentBlocks/ContentBlocksHeader";
import ContentBlocksTable from "@/components/ContentBlocks/ContentBlocksTable";
import {
	blockTypeOptions,
	type BlockFormState,
} from "@/components/ContentBlocks/types";
import type { ContentBlock } from "@/types/ContentBlocks.types";
import { useContentBlocks } from "../hooks/useContentBlocks";
import { usePages } from "../hooks/usePage";
import { usePageSections } from "../hooks/usePageSections";

const formatContent = (content: Record<string, any> | undefined) => {
	if (!content) return "";
	try {
		return JSON.stringify(content, null, 2);
	} catch {
		return "";
	}
};

export default function ContentBlocks() {
	const { data: pages } = usePages();
	const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
	const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
		null,
	);

	const { data: sections } = usePageSections(selectedPageId);
	const {
		data: blocks,
		isLoading,
		create,
		update,
		remove,
		reorder,
	} = useContentBlocks(selectedSectionId);

	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
	const [deleteBlockId, setDeleteBlockId] = useState<number | null>(null);
	const [formState, setFormState] = useState<BlockFormState>({
		blockType: "text",
		position: 0,
		isVisible: true,
		textValue: "",
		imageUrl: "",
		imageAlt: "",
		htmlValue: "",
		listItems: "",
	});

	useEffect(() => {
		if (!selectedPageId && pages && pages.length > 0) {
			setSelectedPageId(pages[0].id);
		}
	}, [pages, selectedPageId]);

	useEffect(() => {
		if (sections && sections.length > 0) {
			setSelectedSectionId(sections[0].id);
		} else {
			setSelectedSectionId(null);
		}
	}, [sections, selectedPageId]);

	const pageOptions = useMemo(() => pages ?? [], [pages]);
	const sectionOptions = useMemo(() => sections ?? [], [sections]);
	const activePage = useMemo(() => {
		return pageOptions.find((page) => page.id === selectedPageId) ?? null;
	}, [pageOptions, selectedPageId]);
	const activeSection = useMemo(() => {
		return (
			sectionOptions.find(
				(section) => section.id === selectedSectionId,
			) ?? null
		);
	}, [sectionOptions, selectedSectionId]);

	const searchValue = searchQuery.trim().toLowerCase();
	const filteredBlocks = useMemo(() => {
		if (!blocks) return [];
		if (!searchValue) return blocks;
		return blocks.filter((block) => {
			const contentString = formatContent(block.content).toLowerCase();
			return (
				block.blockType.toLowerCase().includes(searchValue) ||
				contentString.includes(searchValue) ||
				String(block.id).includes(searchValue)
			);
		});
	}, [blocks, searchValue]);

	const buildFormState = (block?: ContentBlock | null): BlockFormState => {
		const content = block?.content ?? {};
		const listItems = Array.isArray(content.items)
			? content.items.filter((item) => typeof item === "string")
			: [];

		return {
			blockType: block?.blockType ?? "text",
			position: block?.position ?? blocks?.length ?? 0,
			isVisible: block?.isVisible ?? true,
			textValue: typeof content.text === "string" ? content.text : "",
			imageUrl:
				typeof content.url === "string"
					? content.url
					: typeof content.src === "string"
						? content.src
						: "",
			imageAlt: typeof content.alt === "string" ? content.alt : "",
			htmlValue: typeof content.html === "string" ? content.html : "",
			listItems: listItems.join("\n"),
		};
	};

	const clampPosition = (value: number, max: number) => {
		if (Number.isNaN(value)) return 0;
		return Math.max(0, Math.min(value, max));
	};

	const buildReorderPayload = (
		allBlocks: ContentBlock[],
		targetBlock: ContentBlock,
		newPosition: number,
		isNewBlock: boolean,
	) => {
		const list = [...allBlocks].sort((a, b) => a.position - b.position);
		const filtered = isNewBlock
			? list
			: list.filter((block) => block.id !== targetBlock.id);
		const clamped = clampPosition(newPosition, filtered.length);
		filtered.splice(clamped, 0, targetBlock);
		return filtered.map((block, index) => ({
			id: block.id,
			position: index,
		}));
	};

	const openCreate = () => {
		setEditingBlock(null);
		setFormState(buildFormState(null));
		setIsAddOpen(true);
	};

	const openEdit = (block: ContentBlock) => {
		setEditingBlock(block);
		setFormState(buildFormState(block));
	};

	const buildContentPayload = () => {
		switch (formState.blockType) {
			case "text": {
				const text = formState.textValue.trim();
				if (!text) {
					toast.error("Text content is required");
					return null;
				}
				return { text };
			}
			case "image": {
				const url = formState.imageUrl.trim();
				if (!url) {
					toast.error("Image URL is required");
					return null;
				}
				const alt = formState.imageAlt.trim();
				return alt ? { url, alt } : { url };
			}
			case "list": {
				const items = formState.listItems
					.split("\n")
					.map((item) => item.trim())
					.filter(Boolean);
				if (items.length === 0) {
					toast.error("Add at least one list item");
					return null;
				}
				return { items };
			}
			case "html": {
				const html = formState.htmlValue.trim();
				if (!html) {
					toast.error("HTML content is required");
					return null;
				}
				return { html };
			}
			default:
				return {};
		}
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedSectionId) return;

		const parsedContent = buildContentPayload();
		if (!parsedContent) return;

		const payload = {
			blockType: formState.blockType,
			position: formState.position,
			isVisible: formState.isVisible,
			content: parsedContent,
		};

		if (editingBlock) {
			const previousPosition = editingBlock.position;
			update.mutate(
				{ id: editingBlock.id, data: payload },
				{
					onSuccess: (updatedBlock) => {
						toast.success("Block updated successfully");
						if (blocks && formState.position !== previousPosition) {
							const reorderPayload = buildReorderPayload(
								blocks,
								updatedBlock,
								formState.position,
								false,
							);
							reorder.mutate(reorderPayload, {
								onSuccess: () =>
									toast.success("Block positions updated"),
								onError: (error: any) =>
									toast.error(
										error?.message ||
											"Failed to update positions",
									),
							});
						}
						setEditingBlock(null);
					},
					onError: (error: any) => {
						toast.error(error?.message || "Failed to update block");
					},
				},
			);
		} else {
			create.mutate(payload, {
				onSuccess: (createdBlock) => {
					toast.success("Block created successfully");
					if (blocks && formState.position < blocks.length) {
						const reorderPayload = buildReorderPayload(
							blocks,
							createdBlock,
							formState.position,
							true,
						);
						reorder.mutate(reorderPayload, {
							onSuccess: () =>
								toast.success("Block positions updated"),
							onError: (error: any) =>
								toast.error(
									error?.message ||
										"Failed to update positions",
								),
						});
					}
					setIsAddOpen(false);
				},
				onError: (error: any) => {
					toast.error(error?.message || "Failed to create block");
				},
			});
		}
	};

	const handleDeleteConfirm = () => {
		if (deleteBlockId === null) return;

		remove.mutate(deleteBlockId, {
			onSuccess: () => {
				toast.success("Block deleted successfully");
				setDeleteBlockId(null);
			},
			onError: (error: any) => {
				toast.error(error?.message || "Failed to delete block");
			},
		});
	};

	const handlePageChange = (id: number | null) => {
		setSelectedPageId(id);
		setSearchQuery("");
	};

	const handleSectionChange = (id: number | null) => {
		setSelectedSectionId(id);
		setSearchQuery("");
	};

	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
			<div className="space-y-6">
				<ContentBlocksHeader
					pageOptions={pageOptions}
					sectionOptions={sectionOptions}
					selectedPageId={selectedPageId}
					selectedSectionId={selectedSectionId}
					searchQuery={searchQuery}
					onPageChange={handlePageChange}
					onSectionChange={handleSectionChange}
					onSearchChange={setSearchQuery}
					onAdd={openCreate}
					disableSectionSelect={
						!selectedPageId || sectionOptions.length === 0
					}
					disableSearch={!selectedSectionId}
					disableAdd={!selectedSectionId}
				/>

				<ContentBlocksTable
					isLoading={isLoading}
					selectedSectionId={selectedSectionId}
					blocks={filteredBlocks}
					activePage={activePage}
					activeSection={activeSection}
					onEdit={openEdit}
					onDelete={setDeleteBlockId}
				/>
			</div>

			<ContentBlockFormDialog
				open={isAddOpen || !!editingBlock}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingBlock(null);
					}
				}}
				editingBlock={editingBlock}
				activeSection={activeSection}
				formState={formState}
				setFormState={setFormState}
				onSubmit={handleSave}
				blockTypeOptions={blockTypeOptions}
				isSubmitting={create.isPending || update.isPending}
			/>

			<ContentBlockDeleteDialog
				open={deleteBlockId !== null}
				onOpenChange={(open) => !open && setDeleteBlockId(null)}
				onConfirm={handleDeleteConfirm}
				isPending={remove.isPending}
			/>
		</div>
	);
}
