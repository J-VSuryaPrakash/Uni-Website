import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import ContentBlockDeleteDialog from "@/components/ContentBlocks/ContentBlockDeleteDialog";
import ContentBlockFormDialog from "@/components/ContentBlocks/ContentBlockFormDialog";
import {
	blockTypeOptions,
	type BlockFormState,
} from "@/components/ContentBlocks/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { useMenus } from "@/hooks/useMenus";
import { usePages } from "@/hooks/usePage";
import { usePageSections } from "@/hooks/usePageSections";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/types/ContentBlocks.types";

const BLOCK_TYPE_LABELS: Record<string, string> = {
	text: "Text",
	image: "Image",
	list: "List",
	html: "HTML",
	members: "Members",
	table: "Table",
	pdf: "PDF",
	directorate: "Directorate",
};

function formatContentPreview(block: ContentBlock): string {
	const c = block.content ?? {};
	switch (block.blockType) {
		case "text":
			return typeof c.text === "string"
				? c.text.slice(0, 80)
				: "";
		case "image":
			return typeof c.url === "string"
				? c.url.split("/").pop() ?? c.url
				: "";
		case "list":
			return Array.isArray(c.items)
				? `${c.items.length} item${c.items.length !== 1 ? "s" : ""}`
				: "";
		case "html":
			return typeof c.html === "string"
				? c.html.replace(/<[^>]+>/g, " ").trim().slice(0, 80)
				: "";
		case "members":
			return Array.isArray(c.members)
				? `${c.members.length} member${c.members.length !== 1 ? "s" : ""}`
				: "";
		case "table": {
			const cols = Array.isArray(c.headers) ? c.headers.length : 0;
			const rowCount = Array.isArray(c.rows) ? c.rows.length : 0;
			return `${cols} col${cols !== 1 ? "s" : ""}, ${rowCount} row${rowCount !== 1 ? "s" : ""}`;
		}
		case "pdf":
			return typeof c.title === "string"
				? c.title
				: typeof c.url === "string"
					? c.url.split("/").pop() ?? ""
					: "";
		case "directorate": {
			const count = Array.isArray(c.directorateIds) ? c.directorateIds.length : 0;
			const title = typeof c.title === "string" ? c.title : "";
			return title
				? `${title} (${count})`
				: `${count} directorate${count !== 1 ? "s" : ""}`;
		}
		default:
			return "";
	}
}

export default function SectionBlocks() {
	const {
		menuId: menuIdStr,
		pageId: pageIdStr,
		sectionId: sectionIdStr,
	} = useParams<{
		menuId: string;
		pageId: string;
		sectionId: string;
	}>();
	const menuId = Number(menuIdStr);
	const pageId = Number(pageIdStr);
	const sectionId = Number(sectionIdStr);

	const { data: menus } = useMenus();
	const { data: pages } = usePages();
	const { data: sections } = usePageSections(pageId);
	const { data: blocks, isLoading, create, update, remove, reorder } =
		useContentBlocks(sectionId);

	const currentMenu = useMemo(
		() => menus?.find((m) => m.id === menuId) ?? null,
		[menus, menuId],
	);
	const currentPage = useMemo(
		() => pages?.find((p) => p.id === pageId) ?? null,
		[pages, pageId],
	);
	const currentSection = useMemo(
		() => sections?.find((s) => s.id === sectionId) ?? null,
		[sections, sectionId],
	);

	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(
		null,
	);
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
		membersValue: [],
		tableHeaders: [],
		tableRows: [],
		tableHeading: "",
		pdfUrl: "",
		pdfTitle: "",
		directorateTitle: "",
		directorateIds: [],
	});

	const sortedBlocks = useMemo(() => {
		if (!blocks) return [];
		return [...blocks].sort((a, b) => a.position - b.position);
	}, [blocks]);

	const filteredBlocks = useMemo(() => {
		if (!searchQuery.trim()) return sortedBlocks;
		const q = searchQuery.toLowerCase();
		return sortedBlocks.filter(
			(b) =>
				b.blockType.toLowerCase().includes(q) ||
				String(b.id).includes(q),
		);
	}, [sortedBlocks, searchQuery]);

	const buildFormState = (block?: ContentBlock | null): BlockFormState => {
		const c = block?.content ?? {};
		const listItems = Array.isArray(c.items)
			? c.items.filter((i: any) => typeof i === "string")
			: [];
		const membersValue = Array.isArray(c.members)
			? c.members.map((m: any) => ({
					name: m.name ?? "",
					role: m.role ?? "Member",
					photo: m.photo ?? "",
					designation: m.designation ?? "",
					department: m.department ?? "",
					email: m.email ?? "",
					phone: m.phone ?? "",
				}))
			: [];
		const tableHeaders = Array.isArray(c.headers)
			? c.headers.map((h: any) => String(h))
			: [];
		const tableRows = Array.isArray(c.rows)
			? c.rows.map((row: any) =>
					Array.isArray(row)
						? row.map((cell: any) => String(cell))
						: Object.values(row).map((cell: any) => String(cell)),
				)
			: [];
		const pdfUrl =
			block?.blockType === "pdf" && typeof c.url === "string"
				? c.url
				: "";
		const directorateIds = Array.isArray(c.directorateIds)
			? c.directorateIds.filter((id: any) => typeof id === "number")
			: [];

		return {
			blockType: block?.blockType ?? "text",
			position: block?.position ?? (blocks?.length ?? 0),
			isVisible: block?.isVisible ?? true,
			textValue: typeof c.text === "string" ? c.text : "",
			imageUrl:
				block?.blockType !== "pdf"
					? typeof c.url === "string"
						? c.url
						: typeof c.src === "string"
							? c.src
							: ""
					: "",
			imageAlt: typeof c.alt === "string" ? c.alt : "",
			htmlValue: typeof c.html === "string" ? c.html : "",
			listItems: listItems.join("\n"),
			membersValue,
			tableHeaders,
			tableRows,
			tableHeading:
				typeof c.heading === "string" ? c.heading : "",
			pdfUrl,
			pdfTitle: typeof c.title === "string" ? c.title : "",
			directorateTitle:
				block?.blockType === "directorate" &&
				typeof c.title === "string"
					? c.title
					: "",
			directorateIds,
		};
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
					.map((i) => i.trim())
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
			case "members": {
				if (formState.membersValue.length === 0) {
					toast.error("Add at least one member");
					return null;
				}
				const invalid = formState.membersValue.find(
					(m) => !m.name.trim(),
				);
				if (invalid) {
					toast.error("Each member must have a name");
					return null;
				}
				return { members: formState.membersValue };
			}
			case "table": {
				if (formState.tableHeaders.length === 0) {
					toast.error("Add at least one column");
					return null;
				}
				const emptyHeader = formState.tableHeaders.find(
					(h) => !h.trim(),
				);
				if (emptyHeader !== undefined) {
					toast.error("All column names must be filled");
					return null;
				}
				const result: Record<string, any> = {
					headers: formState.tableHeaders,
					rows: formState.tableRows,
				};
				if (formState.tableHeading.trim()) {
					result.heading = formState.tableHeading.trim();
				}
				return result;
			}
			case "pdf": {
				const url = formState.pdfUrl.trim();
				if (!url) {
					toast.error("PDF file or URL is required");
					return null;
				}
				const result: Record<string, any> = { url };
				if (formState.pdfTitle.trim()) {
					result.title = formState.pdfTitle.trim();
				}
				return result;
			}
			case "directorate": {
				if (formState.directorateIds.length === 0) {
					toast.error("Select at least one directorate");
					return null;
				}
				const result: Record<string, any> = {
					directorateIds: formState.directorateIds,
				};
				if (formState.directorateTitle.trim()) {
					result.title = formState.directorateTitle.trim();
				}
				return result;
			}
			default:
				return {};
		}
	};

	const clampPosition = (value: number, max: number) =>
		Number.isNaN(value) ? 0 : Math.max(0, Math.min(value, max));

	const buildReorderPayload = (
		allBlocks: ContentBlock[],
		target: ContentBlock,
		newPos: number,
		isNew: boolean,
	) => {
		const list = [...allBlocks].sort((a, b) => a.position - b.position);
		const filtered = isNew
			? list
			: list.filter((b) => b.id !== target.id);
		const clamped = clampPosition(newPos, filtered.length);
		filtered.splice(clamped, 0, target);
		return filtered.map((b, i) => ({ id: b.id, position: i }));
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const content = buildContentPayload();
		if (!content) return;

		const payload = {
			blockType: formState.blockType,
			position: formState.position,
			isVisible: formState.isVisible,
			content,
		};

		if (editingBlock) {
			const prevPos = editingBlock.position;
			update.mutate(
				{ id: editingBlock.id, data: payload },
				{
					onSuccess: (updated) => {
						toast.success("Block updated");
						if (blocks && formState.position !== prevPos) {
							reorder.mutate(
								buildReorderPayload(
									blocks,
									updated,
									formState.position,
									false,
								),
								{
									onError: (e: any) =>
										toast.error(
											e?.message ||
												"Failed to update positions",
										),
								},
							);
						}
						setEditingBlock(null);
					},
					onError: (e: any) =>
						toast.error(e?.message || "Failed to update block"),
				},
			);
		} else {
			create.mutate(payload, {
				onSuccess: (created) => {
					toast.success("Block created");
					if (blocks && formState.position < blocks.length) {
						reorder.mutate(
							buildReorderPayload(
								blocks,
								created,
								formState.position,
								true,
							),
							{
								onError: (e: any) =>
									toast.error(
										e?.message ||
											"Failed to update positions",
									),
							},
						);
					}
					setIsAddOpen(false);
				},
				onError: (e: any) =>
					toast.error(e?.message || "Failed to create block"),
			});
		}
	};

	const handleDeleteConfirm = () => {
		if (deleteBlockId === null) return;
		remove.mutate(deleteBlockId, {
			onSuccess: () => {
				toast.success("Block deleted");
				setDeleteBlockId(null);
			},
			onError: (e: any) =>
				toast.error(e?.message || "Failed to delete block"),
		});
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

	return (
		<>
			<div className="mx-auto w-full max-w-4xl space-y-5">
				{/* Breadcrumb */}
				<Breadcrumb
					items={[
						{ label: "Content", to: "/content" },
						{
							label: currentMenu?.name ?? `Menu #${menuId}`,
							to: `/content/${menuId}`,
						},
						{
							label: currentPage?.title ?? `Page #${pageId}`,
							to: `/content/${menuId}/${pageId}`,
						},
						{
							label:
								currentSection?.title ??
								`Section #${sectionId}`,
						},
					]}
				/>

				{/* Header */}
				<div className="flex items-end justify-between gap-4">
					<div>
						<h1 className="text-xl font-semibold text-slate-900">
							{currentSection?.title
								? `${currentSection.title}`
								: `Section #${sectionId}`}
						</h1>
						<p className="mt-0.5 text-sm text-slate-500">
							{sortedBlocks.length} content block
							{sortedBlocks.length !== 1 ? "s" : ""} in this
							section.
						</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<div className="relative">
							<Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
							<Input
								placeholder="Search blocks..."
								value={searchQuery}
								onChange={(e) =>
									setSearchQuery(e.target.value)
								}
								className="h-8 w-48 pl-8 text-sm bg-white border-slate-200"
							/>
						</div>
						<Button
							onClick={openCreate}
							size="sm"
							className="h-8 bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
						>
							<Plus size={14} /> New Block
						</Button>
					</div>
				</div>

				{/* Table */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					{/* Column header */}
					<div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
						<span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-20 shrink-0">
							Type
						</span>
						<span className="flex-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
							Preview
						</span>
						<span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-16 text-center">
							Pos
						</span>
						<span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-20 text-center">
							Visibility
						</span>
						<span className="w-16 shrink-0" />
					</div>

					{/* Rows */}
					{isLoading ? (
						<div className="py-12 text-center text-sm text-slate-400 animate-pulse">
							Loading blocks...
						</div>
					) : filteredBlocks.length > 0 ? (
						<div className="divide-y divide-slate-100">
							{filteredBlocks.map((block) => (
								<div
									key={block.id}
									className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors group"
								>
									{/* Type badge */}
									<span className="w-20 shrink-0">
										<Badge className="bg-slate-100 text-slate-600 border-transparent shadow-none font-normal text-xs">
											{BLOCK_TYPE_LABELS[
												block.blockType
											] ?? block.blockType}
										</Badge>
									</span>

									{/* Preview */}
									<span className="flex-1 text-sm text-slate-500 truncate">
										{formatContentPreview(block) || (
											<span className="italic text-slate-300">
												No preview
											</span>
										)}
									</span>

									{/* Position */}
									<span className="w-16 text-center text-xs text-slate-400 font-mono shrink-0">
										{block.position}
									</span>

									{/* Visibility */}
									<span className="w-20 text-center shrink-0">
										<Badge
											className={cn(
												"text-xs font-normal border-transparent shadow-none",
												block.isVisible
													? "bg-emerald-100 text-emerald-700"
													: "bg-slate-100 text-slate-400",
											)}
										>
											{block.isVisible
												? "Visible"
												: "Hidden"}
										</Badge>
									</span>

									{/* Actions */}
									<div className="flex items-center gap-1 w-16 justify-end opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => openEdit(block)}
											className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
											title="Edit block"
										>
											<Pencil size={14} />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												setDeleteBlockId(block.id)
											}
											className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
											title="Delete block"
										>
											<Trash2 size={14} />
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="py-16 text-center">
							<p className="text-sm text-slate-400">
								{searchQuery
									? "No blocks match your search."
									: "No content blocks yet. Add one to start building this section."}
							</p>
							{!searchQuery && (
								<Button
									onClick={openCreate}
									size="sm"
									variant="outline"
									className="mt-3 gap-1.5"
								>
									<Plus size={14} /> Add First Block
								</Button>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Block Form Dialog */}
			<ContentBlockFormDialog
				open={isAddOpen || !!editingBlock}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingBlock(null);
					}
				}}
				editingBlock={editingBlock}
				activeSection={currentSection}
				formState={formState}
				setFormState={setFormState}
				onSubmit={handleSave}
				blockTypeOptions={blockTypeOptions}
				isSubmitting={create.isPending || update.isPending}
			/>

			{/* Delete Dialog */}
			<ContentBlockDeleteDialog
				open={deleteBlockId !== null}
				onOpenChange={(open) => !open && setDeleteBlockId(null)}
				onConfirm={handleDeleteConfirm}
				isPending={remove.isPending}
			/>
		</>
	);
}
