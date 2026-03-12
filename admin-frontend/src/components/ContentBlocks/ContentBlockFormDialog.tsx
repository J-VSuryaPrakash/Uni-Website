import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { uploadFile } from "@/api/upload.api";
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
import { FileText, ImageIcon, Loader2, Upload, X } from "lucide-react";
import DirectorateBlockEditor from "./DirectorateBlockEditor";
import MembersBlockEditor from "./MembersBlockEditor";
import TableBlockEditor from "./TableBlockEditor";
import type { BlockFormState } from "./types";

const BACKEND_ORIGIN = (
	import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");
function resolveImageUrl(url: string) {
	if (!url) return "";
	if (url.startsWith("http")) return url;
	return `${BACKEND_ORIGIN}${url}`;
}

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
	const fileInputRef = useRef<HTMLInputElement>(null);
	const pdfInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isPdfUploading, setIsPdfUploading] = useState(false);
	// true when the current imageUrl was uploaded from device (not manually typed)
	const [isUploadedFile, setIsUploadedFile] = useState(false);
	const [isPdfUploadedFile, setIsPdfUploadedFile] = useState(false);

	// sync isUploadedFile whenever the dialog opens (handles edit mode)
	useEffect(() => {
		if (open) {
			setIsUploadedFile(
				!!formState.imageUrl &&
					formState.imageUrl.startsWith("/uploads/"),
			);
			setIsPdfUploadedFile(
				!!formState.pdfUrl &&
					formState.pdfUrl.startsWith("/uploads/"),
			);
		}
	}, [open]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsUploading(true);
		try {
			const media = await uploadFile(file, "general");
			setFormState((prev) => ({ ...prev, imageUrl: media.url }));
			setIsUploadedFile(true);
			toast.success("Image uploaded");
		} catch {
			toast.error("Image upload failed");
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const handleRemoveImage = () => {
		setFormState((prev) => ({ ...prev, imageUrl: "" }));
		setIsUploadedFile(false);
	};

	const handlePdfUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.type !== "application/pdf") {
			toast.error("Please select a PDF file");
			return;
		}
		if (file.size > 30 * 1024 * 1024) {
			toast.error("PDF file must be under 30 MB");
			return;
		}

		setIsPdfUploading(true);
		try {
			const media = await uploadFile(file, "pdf");
			setFormState((prev) => ({ ...prev, pdfUrl: media.url }));
			setIsPdfUploadedFile(true);
			toast.success("PDF uploaded");
		} catch {
			toast.error("PDF upload failed");
		} finally {
			setIsPdfUploading(false);
			if (pdfInputRef.current) pdfInputRef.current.value = "";
		}
	};

	const handleRemovePdf = () => {
		setFormState((prev) => ({ ...prev, pdfUrl: "" }));
		setIsPdfUploadedFile(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={`bg-white flex flex-col max-h-[90vh] ${formState.blockType === "members" || formState.blockType === "table" || formState.blockType === "directorate" ? "sm:max-w-3xl" : "sm:max-w-150"}`}
			>
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
									{blockTypeOptions.map((type) => {
										const labels: Record<string, string> = {
											members: "Members List",
											table: "Table",
											pdf: "PDF",
											directorate: "Directorate / Faculty",
										};
										return (
											<SelectItem key={type} value={type}>
												{labels[type] ?? type.toUpperCase()}
											</SelectItem>
										);
									})}
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

						{/* ── Text ── */}
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

						{/* ── Image ── */}
						{formState.blockType === "image" ? (
							<div className="grid gap-3">
								{/* Hidden file picker */}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageUpload}
								/>

								{/* Preview + upload button */}
								<div className="flex items-start gap-3">
									<div className="shrink-0 w-24 h-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
										{formState.imageUrl ? (
											<img
												src={resolveImageUrl(
													formState.imageUrl,
												)}
												alt="Preview"
												className="w-full h-full object-cover"
											/>
										) : (
											<ImageIcon className="h-6 w-6 text-slate-300" />
										)}
									</div>
									<div className="flex flex-col gap-2 flex-1">
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="w-full gap-1.5 justify-center"
											disabled={isUploading}
											onClick={() =>
												fileInputRef.current?.click()
											}
										>
											{isUploading ? (
												<>
													<Loader2 className="h-3.5 w-3.5 animate-spin" />
													Uploading...
												</>
											) : (
												<>
													<Upload className="h-3.5 w-3.5" />
													Upload from device
												</>
											)}
										</Button>
										{formState.imageUrl && (
											<button
												type="button"
												onClick={handleRemoveImage}
												className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
											>
												<X className="h-3 w-3" />
												Remove image
											</button>
										)}
									</div>
								</div>

								{/* Uploaded file indicator OR URL input */}
								{isUploadedFile ? (
									<div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
										<ImageIcon className="h-4 w-4 text-emerald-500 shrink-0" />
										<span className="flex-1 text-xs text-emerald-700 truncate font-mono">
											{formState.imageUrl
												.split("/")
												.pop()}
										</span>
										<span className="text-xs text-emerald-500 shrink-0">
											Saved
										</span>
									</div>
								) : (
									<>
										{/* Divider */}
										<div className="flex items-center gap-2">
											<div className="flex-1 border-t border-slate-100" />
											<span className="text-xs text-slate-400">
												or paste a URL
											</span>
											<div className="flex-1 border-t border-slate-100" />
										</div>

										{/* URL input */}
										<div className="grid gap-1.5">
											<Label htmlFor="blockImageUrl">
												Image URL
											</Label>
											<Input
												id="blockImageUrl"
												type="text"
												value={formState.imageUrl}
												onChange={(e) =>
													setFormState((prev) => ({
														...prev,
														imageUrl:
															e.target.value,
													}))
												}
												placeholder="https://example.com/image.jpg"
											/>
										</div>
									</>
								)}

								{/* Alt text */}
								<div className="grid gap-1.5">
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
										placeholder="Describe the image for accessibility"
									/>
								</div>
							</div>
						) : null}

						{/* ── List ── */}
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

						{/* ── HTML ── */}
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

						{/* ── Members ── */}
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

						{/* ── Table ── */}
						{formState.blockType === "table" ? (
							<TableBlockEditor
								heading={formState.tableHeading}
								headers={formState.tableHeaders}
								rows={formState.tableRows}
								onHeadingChange={(tableHeading) =>
									setFormState((prev) => ({
										...prev,
										tableHeading,
									}))
								}
								onHeadersChange={(tableHeaders) =>
									setFormState((prev) => ({
										...prev,
										tableHeaders,
									}))
								}
								onRowsChange={(tableRows) =>
									setFormState((prev) => ({
										...prev,
										tableRows,
									}))
								}
							/>
						) : null}

						{/* ── Directorate ── */}
						{formState.blockType === "directorate" ? (
							<DirectorateBlockEditor
								title={formState.directorateTitle}
								selectedIds={formState.directorateIds}
								onTitleChange={(directorateTitle) =>
									setFormState((prev) => ({
										...prev,
										directorateTitle,
									}))
								}
								onSelectedIdsChange={(directorateIds) =>
									setFormState((prev) => ({
										...prev,
										directorateIds,
									}))
								}
							/>
						) : null}

						{/* ── PDF ── */}
						{formState.blockType === "pdf" ? (
							<div className="grid gap-3">
								{/* Hidden file picker */}
								<input
									ref={pdfInputRef}
									type="file"
									accept="application/pdf"
									className="hidden"
									onChange={handlePdfUpload}
								/>

								{/* Upload button */}
								<div className="flex items-start gap-3">
									<div className="shrink-0 w-24 h-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
										{formState.pdfUrl ? (
											<FileText className="h-8 w-8 text-red-500" />
										) : (
											<FileText className="h-6 w-6 text-slate-300" />
										)}
									</div>
									<div className="flex flex-col gap-2 flex-1">
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="w-full gap-1.5 justify-center"
											disabled={isPdfUploading}
											onClick={() =>
												pdfInputRef.current?.click()
											}
										>
											{isPdfUploading ? (
												<>
													<Loader2 className="h-3.5 w-3.5 animate-spin" />
													Uploading...
												</>
											) : (
												<>
													<Upload className="h-3.5 w-3.5" />
													Upload PDF (max 30 MB)
												</>
											)}
										</Button>
										{formState.pdfUrl && (
											<button
												type="button"
												onClick={handleRemovePdf}
												className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
											>
												<X className="h-3 w-3" />
												Remove PDF
											</button>
										)}
									</div>
								</div>

								{/* Uploaded file indicator OR URL input */}
								{isPdfUploadedFile ? (
									<div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
										<FileText className="h-4 w-4 text-emerald-500 shrink-0" />
										<span className="flex-1 text-xs text-emerald-700 truncate font-mono">
											{formState.pdfUrl
												.split("/")
												.pop()}
										</span>
										<span className="text-xs text-emerald-500 shrink-0">
											Saved
										</span>
									</div>
								) : (
									<>
										<div className="flex items-center gap-2">
											<div className="flex-1 border-t border-slate-100" />
											<span className="text-xs text-slate-400">
												or paste a URL
											</span>
											<div className="flex-1 border-t border-slate-100" />
										</div>
										<div className="grid gap-1.5">
											<Label htmlFor="blockPdfUrl">
												PDF URL
											</Label>
											<Input
												id="blockPdfUrl"
												type="text"
												value={formState.pdfUrl}
												onChange={(e) =>
													setFormState((prev) => ({
														...prev,
														pdfUrl: e.target.value,
													}))
												}
												placeholder="https://example.com/document.pdf"
											/>
										</div>
									</>
								)}

								{/* Title */}
								<div className="grid gap-1.5">
									<Label htmlFor="blockPdfTitle">
										Title (optional)
									</Label>
									<Input
										id="blockPdfTitle"
										value={formState.pdfTitle}
										onChange={(e) =>
											setFormState((prev) => ({
												...prev,
												pdfTitle: e.target.value,
											}))
										}
										placeholder="e.g. Admission Brochure 2025"
									/>
								</div>
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
							disabled={isSubmitting || isUploading || isPdfUploading}
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
