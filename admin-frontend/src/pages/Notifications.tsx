import {
	Bell,
	ExternalLink,
	FileText,
	Film,
	Image,
	Link,
	Loader2,
	Music,
	Paperclip,
	Plus,
	Search,
	ToggleLeft,
	ToggleRight,
	Trash2,
	UploadCloud,
	X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { uploadFile as uploadFileApi } from "@/api/upload.api";

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
import { Switch } from "@/components/ui/switch";
import {
	useNotificationAttachments,
	useNotifications,
} from "@/hooks/useNotifications";
import { useDepartments } from "@/hooks/useDepartments";
import type {
	CreateNotificationDTO,
	Department,
	MediaType,
	Notification,
	NotificationAttachment,
} from "@/types/Notification.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
	"notifications",
	"sports",
	"workshops",
	"examination",
	"tenders",
	"general",
];

const STATUS_OPTIONS = ["open", "closed", "archived"] as const;

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
	{ value: "pdf", label: "PDF Document" },
	{ value: "image", label: "Image (JPG/PNG/GIF)" },
	{ value: "document", label: "Document (DOC/DOCX/XLSX)" },
	{ value: "video", label: "Video" },
	{ value: "audio", label: "Audio" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string | null) => {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const statusBadge = (status: string) => {
	const map: Record<string, string> = {
		open: "bg-green-100 text-green-700",
		closed: "bg-slate-100 text-slate-600",
		archived: "bg-red-100 text-red-700",
	};
	return map[status] ?? "bg-slate-100 text-slate-600";
};

const MediaTypeIcon = ({ type }: { type: MediaType | null }) => {
	switch (type) {
		case "image":
			return <Image className="h-4 w-4 text-blue-500 shrink-0" />;
		case "video":
			return <Film className="h-4 w-4 text-purple-500 shrink-0" />;
		case "audio":
			return <Music className="h-4 w-4 text-pink-500 shrink-0" />;
		case "pdf":
			return <FileText className="h-4 w-4 text-red-500 shrink-0" />;
		default:
			return <FileText className="h-4 w-4 text-slate-400 shrink-0" />;
	}
};

// Maps browser File.type (MIME) to our MediaType enum
const mimeToFrontendType = (mime: string): MediaType => {
	if (mime.startsWith("image/")) return "image";
	if (mime === "application/pdf") return "pdf";
	if (mime.startsWith("video/")) return "video";
	if (mime.startsWith("audio/")) return "audio";
	return "document";
};

const mediaTypeBadgeClass = (type: MediaType | null) => {
	switch (type) {
		case "image":
			return "bg-blue-50 text-blue-600";
		case "video":
			return "bg-purple-50 text-purple-600";
		case "audio":
			return "bg-pink-50 text-pink-600";
		case "pdf":
			return "bg-red-50 text-red-600";
		default:
			return "bg-slate-50 text-slate-500";
	}
};

// ─── Notification Form Dialog ─────────────────────────────────────────────────

interface FormDialogProps {
	isOpen: boolean;
	onOpenChange: (v: boolean) => void;
	editing: Notification | null;
	onCreate: (data: CreateNotificationDTO) => void;
	onUpdate: (id: number, data: Partial<CreateNotificationDTO>) => void;
	isPending: boolean;
	departments: Department[];
}

function NotificationFormDialog({
	isOpen,
	onOpenChange,
	editing,
	onCreate,
	onUpdate,
	isPending,
	departments,
}: FormDialogProps) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);

		const deptIdStr = fd.get("departmentId") as string;
		const data: CreateNotificationDTO = {
			title: fd.get("title") as string,
			category: (fd.get("category") as string) || undefined,
			departmentId: deptIdStr ? Number(deptIdStr) : undefined,
			status: (fd.get("status") as any) || "open",
			priority: Number(fd.get("priority") ?? 0),
			startsAt: (fd.get("startsAt") as string) || undefined,
			endsAt: (fd.get("endsAt") as string) || undefined,
			isScrolling: fd.get("isScrolling") === "on",
			isActive: fd.get("isActive") === "on",
		};

		if (editing) {
			onUpdate(editing.id, data);
		} else {
			onCreate(data);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="bg-white sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Edit Notification" : "Create Notification"}
					</DialogTitle>
					<DialogDescription>
						{editing
							? "Update the notification details below."
							: "Fill in the details to create a new notification. You can add attachments after saving."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					{/* Title */}
					<div className="grid gap-1.5">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							name="title"
							defaultValue={editing?.title}
							placeholder="Notification title..."
							required
						/>
					</div>

					{/* Department */}
					<div className="grid gap-1.5">
						<Label htmlFor="departmentId">Department</Label>
						<select
							id="departmentId"
							name="departmentId"
							defaultValue={editing?.departmentId ?? ""}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
						>
							<option value="">— None —</option>
							{departments.map((d) => (
								<option key={d.id} value={d.id}>
									{d.name}
								</option>
							))}
						</select>
					</div>

					{/* Category + Status */}
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-1.5">
							<Label htmlFor="category">Category</Label>
							<select
								id="category"
								name="category"
								defaultValue={editing?.category ?? ""}
								className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
							>
								<option value="">— None —</option>
								{CATEGORIES.map((c) => (
									<option key={c} value={c}>
										{c.charAt(0).toUpperCase() + c.slice(1)}
									</option>
								))}
							</select>
						</div>

						<div className="grid gap-1.5">
							<Label htmlFor="status">Status</Label>
							<select
								id="status"
								name="status"
								defaultValue={editing?.status ?? "open"}
								className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
							>
								{STATUS_OPTIONS.map((s) => (
									<option key={s} value={s}>
										{s.charAt(0).toUpperCase() + s.slice(1)}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Priority */}
					<div className="grid gap-1.5">
						<Label htmlFor="priority">
							Priority{" "}
							<span className="text-xs font-normal text-slate-400">
								(0 = highest, larger number = lower priority)
							</span>
						</Label>
						<Input
							id="priority"
							name="priority"
							type="number"
							min={0}
							defaultValue={editing?.priority ?? 0}
						/>
					</div>

					{/* Date range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-1.5">
							<Label htmlFor="startsAt">Starts At</Label>
							<Input
								id="startsAt"
								name="startsAt"
								type="datetime-local"
								defaultValue={
									editing?.startsAt
										? editing.startsAt.slice(0, 16)
										: ""
								}
							/>
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="endsAt">Ends At</Label>
							<Input
								id="endsAt"
								name="endsAt"
								type="datetime-local"
								defaultValue={
									editing?.endsAt
										? editing.endsAt.slice(0, 16)
										: ""
								}
							/>
						</div>
					</div>

					{/* Toggles */}
					<div className="flex gap-8">
						<div className="flex items-center gap-2">
							<Switch
								id="isScrolling"
								name="isScrolling"
								defaultChecked={editing?.isScrolling ?? false}
							/>
							<Label htmlFor="isScrolling" className="cursor-pointer">
								Live Scrolling
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="isActive"
								name="isActive"
								defaultChecked={editing?.isActive ?? true}
							/>
							<Label htmlFor="isActive" className="cursor-pointer">
								Active
							</Label>
						</div>
					</div>

					<DialogFooter className="pt-2">
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
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : editing ? (
								"Save Changes"
							) : (
								"Create Notification"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// ─── Attachment Row ───────────────────────────────────────────────────────────

interface AttachmentRowProps {
	att: NotificationAttachment;
	onDelete: (id: number) => void;
	isDeleting: boolean;
}

function AttachmentRow({ att, onDelete, isDeleting }: AttachmentRowProps) {
	const mediaUrl = att.media?.url;
	const mediaType = att.media?.type ?? null;

	return (
		<li className="flex items-start gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors">
			{/* Icon */}
			<div className="mt-0.5">
				<MediaTypeIcon type={mediaType} />
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<p className="text-sm font-medium text-slate-800 truncate">
						{att.title}
					</p>
					{mediaType && (
						<span
							className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${mediaTypeBadgeClass(mediaType)}`}
						>
							{mediaType}
						</span>
					)}
				</div>
				{/* Clickable URL — opens in new tab */}
				{mediaUrl ? (
					<a
						href={mediaUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-0.5 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-colors truncate max-w-xs"
						title={mediaUrl}
					>
						<ExternalLink className="h-3 w-3 shrink-0" />
						<span className="truncate">{mediaUrl}</span>
					</a>
				) : (
					<p className="text-xs text-slate-400 mt-0.5">No URL</p>
				)}
			</div>

			{/* Delete */}
			<Button
				size="icon"
				variant="ghost"
				className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
				title="Delete attachment"
				onClick={() => onDelete(att.id)}
				disabled={isDeleting}
			>
				{isDeleting ? (
					<Loader2 className="h-3.5 w-3.5 animate-spin" />
				) : (
					<Trash2 className="h-3.5 w-3.5" />
				)}
			</Button>
		</li>
	);
}

// ─── Attachments Panel Dialog ─────────────────────────────────────────────────

type AddMode = "upload" | "url";

interface AttachmentsPanelProps {
	notification: Notification | null;
	onClose: () => void;
}

function AttachmentsPanel({ notification, onClose }: AttachmentsPanelProps) {
	const { data: attachments, isLoading, addAttachment, removeAttachment } =
		useNotificationAttachments(notification?.id ?? null);

	// mode: upload a file from disk  OR  paste a URL
	const [mode, setMode] = useState<AddMode>("upload");

	// ── Upload-from-disk state ──
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pickedFile, setPickedFile] = useState<File | null>(null);
	const [uploadTitle, setUploadTitle] = useState("");
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	// ── URL mode state ──
	const [attTitle, setAttTitle] = useState("");
	const [attUrl, setAttUrl] = useState("");
	const [attType, setAttType] = useState<MediaType>("pdf");

	const [deletingId, setDeletingId] = useState<number | null>(null);

	const resetUploadForm = () => {
		setPickedFile(null);
		setUploadTitle("");
		setUploadProgress(0);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const resetUrlForm = () => {
		setAttTitle("");
		setAttUrl("");
		setAttType("pdf");
	};

	// ── Handle file picked from disk ──
	const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		setPickedFile(file);
		// Pre-fill title from filename (without extension)
		if (file && !uploadTitle) {
			setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
		}
	};

	// ── Upload file then create attachment ──
	const handleUploadAndAttach = async () => {
		if (!pickedFile) {
			toast.error("Please select a file to upload");
			return;
		}
		if (!uploadTitle.trim()) {
			toast.error("Please enter a display title for this attachment");
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		try {
			// 1. Upload file → get Media record back
			const media = await uploadFileApi(
				pickedFile,
				"notifications",
				(pct) => setUploadProgress(pct),
			);

			// 2. Create NotificationAttachment linking to uploaded media
			await new Promise<void>((resolve, reject) => {
				addAttachment.mutate(
					{
						notificationId: notification!.id,
						title: uploadTitle.trim(),
						url: media.url,
						mediaType: (media.type ?? "document") as MediaType,
						position: attachments?.length ?? 0,
					},
					{
						onSuccess: () => resolve(),
						onError: (err) => reject(err),
					},
				);
			});

			toast.success("File uploaded and attached successfully");
			resetUploadForm();
		} catch (err: any) {
			toast.error(
				err?.response?.data?.message ??
					err?.message ??
					"Upload failed. Please try again.",
			);
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	// ── Add from URL ──
	const handleAddFromUrl = () => {
		if (!attTitle.trim()) {
			toast.error("Please enter a title for the attachment");
			return;
		}
		if (!attUrl.trim()) {
			toast.error("Please enter the URL of the file");
			return;
		}

		addAttachment.mutate(
			{
				notificationId: notification!.id,
				title: attTitle.trim(),
				url: attUrl.trim(),
				mediaType: attType,
				position: attachments?.length ?? 0,
			},
			{
				onSuccess: () => {
					toast.success("Attachment added successfully");
					resetUrlForm();
				},
				onError: (err: any) =>
					toast.error(
						err?.response?.data?.message ?? "Failed to add attachment",
					),
			},
		);
	};

	// ── Delete attachment ──
	const handleDelete = (id: number) => {
		setDeletingId(id);
		removeAttachment.mutate(id, {
			onSuccess: () => {
				toast.success("Attachment deleted");
				setDeletingId(null);
			},
			onError: () => {
				toast.error("Failed to delete attachment");
				setDeletingId(null);
			},
		});
	};

	return (
		<Dialog open={!!notification} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="bg-white sm:max-w-lg max-h-[90vh] flex flex-col">
				<DialogHeader className="shrink-0">
					<DialogTitle className="flex items-center gap-2">
						<Paperclip className="h-4 w-4 text-indigo-600" />
						Manage Attachments
					</DialogTitle>
					<DialogDescription className="line-clamp-2 text-slate-500">
						{notification?.title}
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto space-y-5 pr-0.5">
					{/* ── Mode switcher ── */}
					<div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 gap-1">
						<button
							onClick={() => setMode("upload")}
							className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
								mode === "upload"
									? "bg-white text-indigo-700 shadow-sm"
									: "text-slate-500 hover:text-slate-700"
							}`}
						>
							<UploadCloud className="h-4 w-4" />
							Upload from Computer
						</button>
						<button
							onClick={() => setMode("url")}
							className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
								mode === "url"
									? "bg-white text-indigo-700 shadow-sm"
									: "text-slate-500 hover:text-slate-700"
							}`}
						>
							<Link className="h-4 w-4" />
							Paste a URL
						</button>
					</div>

					{/* ── Upload from computer ── */}
					{mode === "upload" && (
						<div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
							{/* File drop zone */}
							<div
								onClick={() => fileInputRef.current?.click()}
								className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 cursor-pointer transition-colors ${
									pickedFile
										? "border-indigo-300 bg-indigo-50/40"
										: "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
								}`}
							>
								<input
									ref={fileInputRef}
									type="file"
									className="hidden"
									accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/*,audio/*"
									onChange={handleFilePick}
								/>
								{pickedFile ? (
									<>
										<div className="flex items-center gap-2">
											<MediaTypeIcon
												type={mimeToFrontendType(
													pickedFile.type,
												)}
											/>
											<span className="text-sm font-medium text-slate-700 max-w-60 truncate">
												{pickedFile.name}
											</span>
											<button
												onClick={(e) => {
													e.stopPropagation();
													resetUploadForm();
												}}
												className="text-slate-400 hover:text-red-500 transition-colors"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
										<p className="text-xs text-slate-400">
											{(pickedFile.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</>
								) : (
									<>
										<UploadCloud className="h-8 w-8 text-slate-300" />
										<p className="text-sm font-medium text-slate-500">
											Click to browse files
										</p>
										<p className="text-xs text-slate-400">
											PDF, Images, Word, Excel, Video, Audio — up to 100 MB
										</p>
									</>
								)}
							</div>

							{/* Display title */}
							<div className="grid gap-1">
								<Label className="text-xs text-slate-600">
									Display Title *
								</Label>
								<Input
									placeholder="e.g. Application Form 2024"
									value={uploadTitle}
									onChange={(e) => setUploadTitle(e.target.value)}
									className="h-9 text-sm bg-white"
								/>
							</div>

							{/* Progress bar */}
							{isUploading && (
								<div className="space-y-1">
									<div className="flex justify-between text-xs text-slate-500">
										<span>Uploading…</span>
										<span>{uploadProgress}%</span>
									</div>
									<div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
										<div
											className="h-full bg-indigo-500 rounded-full transition-all duration-200"
											style={{ width: `${uploadProgress}%` }}
										/>
									</div>
								</div>
							)}

							<Button
								className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
								onClick={handleUploadAndAttach}
								disabled={isUploading || !pickedFile}
							>
								{isUploading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Uploading... {uploadProgress}%
									</>
								) : (
									<>
										<UploadCloud className="mr-2 h-4 w-4" />
										Upload & Attach
									</>
								)}
							</Button>
						</div>
					)}

					{/* ── Paste a URL ── */}
					{mode === "url" && (
						<div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
							<div className="grid gap-1">
								<Label className="text-xs text-slate-600">
									Display Title *
								</Label>
								<Input
									placeholder="e.g. Application Form 2024"
									value={attTitle}
									onChange={(e) => setAttTitle(e.target.value)}
									className="h-9 text-sm bg-white"
								/>
							</div>

							<div className="grid gap-1">
								<Label className="text-xs text-slate-600">
									File URL *{" "}
									<span className="text-slate-400 font-normal">
										(publicly accessible link)
									</span>
								</Label>
								<Input
									type="url"
									placeholder="https://example.com/document.pdf"
									value={attUrl}
									onChange={(e) => setAttUrl(e.target.value)}
									className="h-9 text-xs bg-white font-mono"
								/>
							</div>

							<div className="grid gap-1">
								<Label className="text-xs text-slate-600">
									File Type *
								</Label>
								<select
									value={attType}
									onChange={(e) =>
										setAttType(e.target.value as MediaType)
									}
									className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
								>
									{MEDIA_TYPES.map((t) => (
										<option key={t.value} value={t.value}>
											{t.label}
										</option>
									))}
								</select>
							</div>

							<Button
								className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
								onClick={handleAddFromUrl}
								disabled={addAttachment.isPending}
							>
								{addAttachment.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Adding...
									</>
								) : (
									<>
										<Plus className="mr-2 h-4 w-4" />
										Add Attachment
									</>
								)}
							</Button>
						</div>
					)}

					{/* ── Existing attachments ── */}
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
							Current Attachments
						</p>
						{isLoading ? (
							<div className="flex justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin text-slate-300" />
							</div>
						) : attachments && attachments.length > 0 ? (
							<ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
								{attachments.map((att) => (
									<AttachmentRow
										key={att.id}
										att={att}
										onDelete={handleDelete}
										isDeleting={deletingId === att.id}
									/>
								))}
							</ul>
						) : (
							<div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-slate-200 text-slate-400">
								<Paperclip className="h-8 w-8 mb-2 opacity-30" />
								<p className="text-sm">No attachments yet.</p>
								<p className="text-xs mt-0.5">
									Upload a file or paste a URL above.
								</p>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
	const { data: notifications, isLoading, create, update, toggle } =
		useNotifications();
	const { data: departments = [] } = useDepartments();

	const [search, setSearch] = useState("");
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingNotif, setEditingNotif] = useState<Notification | null>(null);
	const [attachmentNotif, setAttachmentNotif] =
		useState<Notification | null>(null);

	const filtered = useMemo(() => {
		if (!notifications) return [];
		return notifications.filter((n) => {
			const matchSearch =
				!search ||
				n.title.toLowerCase().includes(search.toLowerCase()) ||
				(n.category ?? "").toLowerCase().includes(search.toLowerCase());
			const matchCat =
				filterCategory === "all" || n.category === filterCategory;
			const matchStatus =
				filterStatus === "all" || n.status === filterStatus;
			return matchSearch && matchCat && matchStatus;
		});
	}, [notifications, search, filterCategory, filterStatus]);

	const handleCreate = (data: CreateNotificationDTO) => {
		create.mutate(data, {
			onSuccess: (created) => {
				toast.success("Notification created — you can now add attachments");
				setIsFormOpen(false);
				// Automatically open attachments panel for the new notification
				setAttachmentNotif(created as unknown as Notification);
			},
			onError: () => toast.error("Failed to create notification"),
		});
	};

	const handleUpdate = (id: number, data: Partial<CreateNotificationDTO>) => {
		update.mutate(
			{ id, data },
			{
				onSuccess: () => {
					toast.success("Notification updated");
					setEditingNotif(null);
					setIsFormOpen(false);
				},
				onError: () => toast.error("Failed to update notification"),
			},
		);
	};

	const handleToggle = (notif: Notification) => {
		toggle.mutate(notif.id, {
			onSuccess: () =>
				toast.success(
					notif.isActive
						? "Notification deactivated"
						: "Notification activated",
				),
			onError: () => toast.error("Failed to toggle status"),
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="flex items-center gap-2 text-slate-400 animate-pulse font-medium">
					<Loader2 className="h-5 w-5 animate-spin" />
					Loading Notifications...
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="mx-auto w-full max-w-7xl space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
							<Bell className="h-6 w-6 text-indigo-600" />
							Notifications
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Manage notifications, circulars, and live scrolling
							items. Click{" "}
							<Paperclip className="inline h-3.5 w-3.5" /> to add
							files.
						</p>
					</div>
					<Button
						onClick={() => {
							setEditingNotif(null);
							setIsFormOpen(true);
						}}
						className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm self-start sm:self-auto"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Notification
					</Button>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap gap-3">
					<div className="relative flex-1 min-w-50">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
						<Input
							placeholder="Search notifications..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 bg-white border-slate-200"
						/>
					</div>
					<select
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
						className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
					>
						<option value="all">All Categories</option>
						{CATEGORIES.map((c) => (
							<option key={c} value={c}>
								{c.charAt(0).toUpperCase() + c.slice(1)}
							</option>
						))}
					</select>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
					>
						<option value="all">All Status</option>
						{STATUS_OPTIONS.map((s) => (
							<option key={s} value={s}>
								{s.charAt(0).toUpperCase() + s.slice(1)}
							</option>
						))}
					</select>
				</div>

				{/* Summary chips */}
				<div className="flex flex-wrap gap-2">
					<span className="text-xs rounded-full px-3 py-1 bg-slate-100 text-slate-600 font-medium">
						Total: {notifications?.length ?? 0}
					</span>
					<span className="text-xs rounded-full px-3 py-1 bg-green-100 text-green-700 font-medium">
						Active:{" "}
						{notifications?.filter((n) => n.isActive).length ?? 0}
					</span>
					<span className="text-xs rounded-full px-3 py-1 bg-blue-100 text-blue-700 font-medium">
						Live Scroll:{" "}
						{notifications?.filter(
							(n) => n.isScrolling && n.isActive,
						).length ?? 0}
					</span>
					<span className="text-xs rounded-full px-3 py-1 bg-amber-100 text-amber-700 font-medium">
						Showing: {filtered.length}
					</span>
				</div>

				{/* Table */}
				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
					<div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-1">ID</div>
						<div className="col-span-3">Title</div>
						<div className="col-span-1 text-center">Category</div>
						<div className="col-span-1 text-center">Status</div>
						<div className="col-span-1 text-center">Priority</div>
						<div className="col-span-1 text-center">Scroll</div>
						<div className="col-span-1 text-center">Active</div>
						<div className="col-span-2 text-center">Dates</div>
						<div className="col-span-1 text-right">Actions</div>
					</div>

					<div className="divide-y divide-slate-100">
						{filtered.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-slate-400">
								<Bell className="h-10 w-10 mb-3 opacity-30" />
								<p className="font-medium">
									No notifications found.
								</p>
								<p className="text-sm mt-1">
									Adjust filters or create a new notification.
								</p>
							</div>
						) : (
							filtered.map((notif) => (
								<div
									key={notif.id}
									className="grid grid-cols-12 gap-2 items-center px-4 py-3 hover:bg-slate-50/60 transition-colors"
								>
									{/* ID */}
									<div className="col-span-1 text-xs text-slate-400 font-mono">
										#{notif.id}
									</div>

									{/* Title */}
									<div className="col-span-3">
										<p className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
											{notif.title}
										</p>
										{notif.department && (
											<p className="text-xs text-slate-400 mt-0.5">
												{notif.department.name}
											</p>
										)}
										{/* Attachment count pill */}
										{notif.attachments &&
											notif.attachments.length > 0 && (
												<button
													onClick={() =>
														setAttachmentNotif(notif)
													}
													className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full hover:bg-indigo-100 transition-colors"
												>
													<Paperclip className="h-2.5 w-2.5" />
													{notif.attachments.length} file
													{notif.attachments.length !==
														1 && "s"}
												</button>
											)}
									</div>

									{/* Category */}
									<div className="col-span-1 text-center">
										{notif.category ? (
											<span className="text-xs rounded-full px-2 py-0.5 bg-indigo-50 text-indigo-600 font-medium capitalize">
												{notif.category}
											</span>
										) : (
											<span className="text-slate-300 text-xs">
												—
											</span>
										)}
									</div>

									{/* Status */}
									<div className="col-span-1 text-center">
										<span
											className={`text-xs rounded-full px-2 py-0.5 font-medium capitalize ${statusBadge(notif.status)}`}
										>
											{notif.status}
										</span>
									</div>

									{/* Priority */}
									<div className="col-span-1 text-center text-sm font-medium text-slate-600">
										{notif.priority}
									</div>

									{/* Scrolling */}
									<div className="col-span-1 flex justify-center">
										{notif.isScrolling ? (
											<span className="text-xs rounded-full px-2 py-0.5 bg-blue-100 text-blue-700 font-medium">
												Yes
											</span>
										) : (
											<span className="text-xs text-slate-300">
												No
											</span>
										)}
									</div>

									{/* Active toggle */}
									<div className="col-span-1 flex justify-center">
										<button
											onClick={() => handleToggle(notif)}
											disabled={toggle.isPending}
											title={
												notif.isActive
													? "Click to deactivate"
													: "Click to activate"
											}
											className="transition-transform hover:scale-110"
										>
											{notif.isActive ? (
												<ToggleRight className="h-6 w-6 text-green-500" />
											) : (
												<ToggleLeft className="h-6 w-6 text-slate-300" />
											)}
										</button>
									</div>

									{/* Dates */}
									<div className="col-span-2 text-center">
										<p className="text-xs text-slate-500">
											{formatDate(notif.startsAt)}
										</p>
										<p className="text-xs text-slate-400">
											→ {formatDate(notif.endsAt)}
										</p>
									</div>

									{/* Actions */}
									<div className="col-span-1 flex items-center justify-end gap-1">
										{/* Attachments */}
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
											title="Add / manage file attachments"
											onClick={() =>
												setAttachmentNotif(notif)
											}
										>
											<Paperclip className="h-3.5 w-3.5" />
										</Button>

										{/* Edit */}
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
											title="Edit notification"
											onClick={() => {
												setEditingNotif(notif);
												setIsFormOpen(true);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												className="h-3.5 w-3.5"
											>
												<path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
											</svg>
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Create / Edit dialog */}
			<NotificationFormDialog
				isOpen={isFormOpen}
				onOpenChange={(v) => {
					setIsFormOpen(v);
					if (!v) setEditingNotif(null);
				}}
				editing={editingNotif}
				onCreate={handleCreate}
				onUpdate={handleUpdate}
				isPending={create.isPending || update.isPending}
				departments={departments}
			/>

			{/* Attachments panel */}
			<AttachmentsPanel
				notification={attachmentNotif}
				onClose={() => setAttachmentNotif(null)}
			/>
		</>
	);
}
