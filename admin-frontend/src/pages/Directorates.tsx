import {
	Image,
	Link2,
	Loader2,
	Pencil,
	Plus,
	Search,
	Trash2,
	Users,
	X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { uploadFile } from "@/api/upload.api";
import {
	getAllPageDirectorates,
	linkDirectorateToPage,
	unlinkDirectorateFromPage,
} from "@/api/pageDirectorates.api";
import { getPages } from "@/api/pages.api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useDirectorates } from "@/hooks/useDirectorates";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateDirectorateDTO,
	Directorate,
	DirectorateProfile,
} from "@/types/Directorate.types";
import type { Page } from "@/types/Page.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BACKEND_ORIGIN = "http://localhost:4000";

function resolveUrl(url: string) {
	if (!url) return "";
	if (url.startsWith("http")) return url;
	return `${BACKEND_ORIGIN}${url}`;
}

const NONE = "__none__";

// ─── Multi-select Combobox for Designations ───────────────────────────────────

interface DesignationMultiSelectProps {
	options: { id: number; title: string; category: string }[];
	selected: number[];
	onChange: (ids: number[]) => void;
}

function DesignationMultiSelect({
	options,
	selected,
	onChange,
}: DesignationMultiSelectProps) {
	const toggle = (id: number) => {
		onChange(
			selected.includes(id)
				? selected.filter((x) => x !== id)
				: [...selected, id],
		);
	};

	return (
		<div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white p-2 space-y-1">
			{options.length === 0 ? (
				<p className="text-xs text-slate-400 text-center py-2">
					No designations available
				</p>
			) : (
				options.map((opt) => (
					<label
						key={opt.id}
						className="flex items-center gap-2 rounded px-2 py-1 hover:bg-slate-50 cursor-pointer"
					>
						<Checkbox
							checked={selected.includes(opt.id)}
							onCheckedChange={() => toggle(opt.id)}
						/>
						<span className="text-sm text-slate-700">{opt.title}</span>
						<span className="ml-auto text-xs text-slate-400">
							{opt.category}
						</span>
					</label>
				))
			)}
		</div>
	);
}

// ─── Directorate Form Dialog ──────────────────────────────────────────────────

interface FormDialogProps {
	isOpen: boolean;
	onOpenChange: (v: boolean) => void;
	editing: Directorate | null;
	isPending: boolean;
	onSubmit: (data: CreateDirectorateDTO) => void;
	allDesignations: { id: number; title: string; category: string }[];
	allDepartments: { id: number; name: string }[];
}

function DirectorateFormDialog({
	isOpen,
	onOpenChange,
	editing,
	isPending,
	onSubmit,
	allDesignations,
	allDepartments,
}: FormDialogProps) {
	const initProfile = (): DirectorateProfile => ({
		qualifications: editing?.profile?.qualifications ?? [],
		contact: {
			email: editing?.profile?.contact?.email ?? "",
			phone: editing?.profile?.contact?.phone ?? "",
			website: editing?.profile?.contact?.website ?? "",
		},
	});

	const [name, setName] = useState(editing?.name ?? "");
	const [isActive, setIsActive] = useState(editing?.isActive ?? true);
	const [departmentId, setDepartmentId] = useState<string>(
		editing?.department?.id?.toString() ?? NONE,
	);
	const [selectedDesigIds, setSelectedDesigIds] = useState<number[]>(
		editing?.designations?.map((d) => d.designation.id) ?? [],
	);
	const [photoMediaId, setPhotoMediaId] = useState<number | null>(
		editing?.photoMediaId ?? null,
	);
	const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>(
		editing?.photo?.url ? resolveUrl(editing.photo.url) : "",
	);
	const [isUploading, setIsUploading] = useState(false);
	const [profile, setProfile] = useState<DirectorateProfile>(initProfile);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Re-seed all form fields whenever the dialog opens or the target record changes.
	// (Radix Dialog does NOT fire onOpenChange(true) when the parent sets open={true}
	// programmatically, so useState initialisers alone are not enough.)
	useEffect(() => {
		if (!isOpen) return;
		setName(editing?.name ?? "");
		setIsActive(editing?.isActive ?? true);
		setDepartmentId(editing?.department?.id?.toString() ?? NONE);
		setSelectedDesigIds(
			editing?.designations?.map((d) => d.designation.id) ?? [],
		);
		setPhotoMediaId(editing?.photoMediaId ?? null);
		setPhotoPreviewUrl(
			editing?.photo?.url ? resolveUrl(editing.photo.url) : "",
		);
		setProfile({
			qualifications: editing?.profile?.qualifications ?? [],
			contact: {
				email: editing?.profile?.contact?.email ?? "",
				phone: editing?.profile?.contact?.phone ?? "",
				website: editing?.profile?.contact?.website ?? "",
			},
		});
	}, [isOpen, editing]);

	const resetForm = () => {
		setName(editing?.name ?? "");
		setIsActive(editing?.isActive ?? true);
		setDepartmentId(editing?.department?.id?.toString() ?? NONE);
		setSelectedDesigIds(
			editing?.designations?.map((d) => d.designation.id) ?? [],
		);
		setPhotoMediaId(editing?.photoMediaId ?? null);
		setPhotoPreviewUrl(
			editing?.photo?.url ? resolveUrl(editing.photo.url) : "",
		);
		setProfile(initProfile());
	};

	const handleOpenChange = (v: boolean) => {
		if (v) resetForm();
		onOpenChange(v);
	};

	const handlePhotoChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsUploading(true);
		try {
			const media = await uploadFile(file, "faculty");
			setPhotoMediaId(media.id);
			setPhotoPreviewUrl(resolveUrl(media.url));
			toast.success("Photo uploaded");
		} catch {
			toast.error("Photo upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const addQualification = () => {
		setProfile((p) => ({
			...p,
			qualifications: [...(p.qualifications ?? []), ""],
		}));
	};

	const updateQualification = (idx: number, val: string) => {
		setProfile((p) => {
			const updated = [...(p.qualifications ?? [])];
			updated[idx] = val;
			return { ...p, qualifications: updated };
		});
	};

	const removeQualification = (idx: number) => {
		setProfile((p) => ({
			...p,
			qualifications: (p.qualifications ?? []).filter((_, i) => i !== idx),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		const cleanProfile: DirectorateProfile = {
			qualifications: (profile.qualifications ?? []).filter((q) => q.trim()),
			contact: {
				email: profile.contact?.email?.trim() || undefined,
				phone: profile.contact?.phone?.trim() || undefined,
				website: profile.contact?.website?.trim() || undefined,
			},
		};

		onSubmit({
			name: name.trim(),
			isActive,
			designationIds: selectedDesigIds,
			departmentId: departmentId && departmentId !== NONE ? Number(departmentId) : null,
			photoMediaId,
			profile: cleanProfile,
		});
	};

	// Live preview of designation title line
	const designationPreview = selectedDesigIds.length > 0
		? selectedDesigIds
			.map((id) => allDesignations.find((d) => d.id === id)?.title ?? "")
			.filter(Boolean)
			.join(" | ")
		: null;

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Edit Faculty Member" : "Add Faculty Member"}
					</DialogTitle>
					<DialogDescription>
						Fields are ordered to match how they appear on the faculty card.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="py-2 space-y-0 divide-y divide-slate-100">

					{/* ── Row 1: Photo + Name (mirrors card layout) ── */}
					<div className="pb-5 pt-1">
						<p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
							Photo &amp; Name
						</p>
						<div className="flex gap-4 items-start">
							{/* Photo — portrait style matching card */}
							<div className="flex-shrink-0 flex flex-col items-center gap-2">
								<div
									className="w-20 h-24 bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center"
									style={{ borderRadius: "2px" }}
								>
									{photoPreviewUrl ? (
										<img
											src={photoPreviewUrl}
											alt="Preview"
											className="w-full h-full object-cover object-top"
										/>
									) : (
										<Image className="h-8 w-8 text-slate-300" />
									)}
								</div>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handlePhotoChange}
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="text-xs h-7 px-2"
									disabled={isUploading}
									onClick={() => fileInputRef.current?.click()}
								>
									{isUploading ? (
										<Loader2 className="h-3 w-3 animate-spin" />
									) : (
										"Upload"
									)}
								</Button>
								{photoMediaId && (
									<button
										type="button"
										className="text-[10px] text-red-400 hover:text-red-600"
										onClick={() => {
											setPhotoMediaId(null);
											setPhotoPreviewUrl("");
										}}
									>
										Remove
									</button>
								)}
							</div>

							{/* Name + Active */}
							<div className="flex-1 space-y-3">
								<div className="grid gap-1.5">
									<Label htmlFor="dir-name">
										Full Name *
									</Label>
									<Input
										id="dir-name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="e.g. Dr. John Doe"
										required
										autoFocus
									/>
								</div>
								<div className="flex items-center gap-2">
									<Checkbox
										id="dir-active"
										checked={isActive}
										onCheckedChange={(v) => setIsActive(!!v)}
									/>
									<Label htmlFor="dir-active" className="cursor-pointer text-sm font-normal text-slate-600">
										Mark as active (visible on public pages)
									</Label>
								</div>
							</div>
						</div>
					</div>

					{/* ── Row 2: Designation / Title line ── */}
					<div className="py-5">
						<div className="flex items-center justify-between mb-1">
							<p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
								Designation / Title
							</p>
							<span className="text-[10px] text-slate-400">
								Shown as "Professor | Head of Department" on the card
							</span>
						</div>

						{/* Live preview */}
						<div className="mb-2 min-h-[28px] rounded bg-blue-50 border border-blue-100 px-3 py-1.5 flex items-center">
							{designationPreview ? (
								<span className="text-xs font-semibold text-blue-800">
									{designationPreview}
								</span>
							) : (
								<span className="text-xs text-slate-400 italic">
									No designation selected — select below to preview
								</span>
							)}
						</div>

						<DesignationMultiSelect
							options={allDesignations}
							selected={selectedDesigIds}
							onChange={setSelectedDesigIds}
						/>

						{allDesignations.length === 0 && (
							<p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2.5 py-1.5">
								No designations available. Go to{" "}
								<strong>Designations</strong> in the sidebar to create
								titles like "Professor", "Head of Department", etc.
							</p>
						)}
					</div>

					{/* ── Row 3: Qualifications ── */}
					<div className="py-5">
						<p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
							Qualifications
						</p>
						<div className="space-y-2">
							{(profile.qualifications ?? []).map((q, idx) => (
								<div key={idx} className="flex items-center gap-2">
									<Input
										value={q}
										onChange={(e) =>
											updateQualification(idx, e.target.value)
										}
										placeholder="e.g. Ph.D. (Computer Science), M.Tech"
										className="flex-1"
									/>
									<Button
										type="button"
										size="icon"
										variant="ghost"
										className="h-8 w-8 text-slate-400 hover:text-red-500"
										onClick={() => removeQualification(idx)}
									>
										<X className="h-3.5 w-3.5" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addQualification}
							>
								<Plus className="mr-1 h-3.5 w-3.5" />
								Add Qualification
							</Button>
						</div>
					</div>

					{/* ── Row 4: Department ── */}
					<div className="py-5">
						<p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
							Department
						</p>
						<Select value={departmentId} onValueChange={setDepartmentId}>
							<SelectTrigger className="bg-white">
								<SelectValue placeholder="Select department (optional)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE}>None</SelectItem>
								{allDepartments.map((dept) => (
									<SelectItem key={dept.id} value={dept.id.toString()}>
										{dept.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* ── Row 5: Institution address — informational only ── */}
					<div className="py-4">
						<p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
							Institution Address
						</p>
						<p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-3 py-2 leading-relaxed">
							University College of Engineering, Jawaharlal Nehru
							Technological University, Kakinada&#8209;533003, Andhra Pradesh
							<span className="ml-2 text-[10px] text-slate-400">(fixed — displayed on all cards)</span>
						</p>
					</div>

					{/* ── Row 6: Contact ── */}
					<div className="py-5">
						<p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
							Contact Details
						</p>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="grid gap-1.5">
								<Label htmlFor="contact-email">Email</Label>
								<Input
									id="contact-email"
									type="email"
									value={profile.contact?.email ?? ""}
									onChange={(e) =>
										setProfile((p) => ({
											...p,
											contact: { ...p.contact, email: e.target.value },
										}))
									}
									placeholder="email@example.com"
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="contact-phone">Phone</Label>
								<Input
									id="contact-phone"
									value={profile.contact?.phone ?? ""}
									onChange={(e) =>
										setProfile((p) => ({
											...p,
											contact: { ...p.contact, phone: e.target.value },
										}))
									}
									placeholder="+91 98765 43210"
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="contact-website">Website</Label>
								<Input
									id="contact-website"
									value={profile.contact?.website ?? ""}
									onChange={(e) =>
										setProfile((p) => ({
											...p,
											contact: { ...p.contact, website: e.target.value },
										}))
									}
									placeholder="https://..."
								/>
							</div>
						</div>
					</div>

					<DialogFooter className="pt-4">
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
							disabled={isPending || isUploading}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : editing ? (
								"Save Changes"
							) : (
								"Add Faculty Member"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteDialogProps {
	directorate: Directorate | null;
	onConfirm: () => void;
	onCancel: () => void;
	isPending: boolean;
}

function DeleteConfirmDialog({
	directorate,
	onConfirm,
	onCancel,
	isPending,
}: DeleteDialogProps) {
	return (
		<Dialog open={!!directorate} onOpenChange={(v) => !v && onCancel()}>
			<DialogContent className="bg-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-red-600">
						Delete Directorate
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete{" "}
						<span className="font-semibold text-slate-800">
							"{directorate?.name}"
						</span>
						? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="pt-2">
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isPending}
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							"Delete Directorate"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ─── Assign Pages Dialog ──────────────────────────────────────────────────────

interface AssignPagesDialogProps {
	directorate: Directorate | null;
	onClose: () => void;
}

function AssignPagesDialog({ directorate, onClose }: AssignPagesDialogProps) {
	const qc = useQueryClient();
	const [search, setSearch] = useState("");
	// Track only the user's delta — no useEffect initialisation needed
	const [added, setAdded] = useState<Set<number>>(new Set());
	const [removed, setRemoved] = useState<Set<number>>(new Set());
	const [isSaving, setIsSaving] = useState(false);

	const { data: allPages = [], isLoading: pagesLoading } = useQuery<Page[]>({
		queryKey: ["pages"],
		queryFn: getPages,
		staleTime: 5 * 60 * 1000,
		enabled: !!directorate,
	});

	const { data: allLinks = [], isLoading: linksLoading } = useQuery({
		queryKey: ["page-directorates-all"],
		queryFn: getAllPageDirectorates,
		staleTime: 60 * 1000,
		enabled: !!directorate,
	});

	// Derive which pages are currently assigned on the server (stable via useMemo)
	const serverAssigned = useMemo(
		() =>
			new Set(
				allLinks
					.filter((l) => l.directorateId === directorate?.id)
					.map((l) => l.pageId),
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[allLinks, directorate?.id],
	);

	// Compute effective checked state without any setState
	const isChecked = (pageId: number) => {
		if (removed.has(pageId)) return false;
		if (added.has(pageId)) return true;
		return serverAssigned.has(pageId);
	};

	const selectedCount =
		serverAssigned.size - removed.size + added.size;

	const toggle = (pageId: number) => {
		const checked = isChecked(pageId);
		if (checked) {
			// Was in added → undo add; otherwise mark removed
			if (added.has(pageId)) {
				setAdded((p) => { const n = new Set(p); n.delete(pageId); return n; });
			} else {
				setRemoved((p) => new Set([...p, pageId]));
			}
		} else {
			// Was in removed → undo remove; otherwise mark added
			if (removed.has(pageId)) {
				setRemoved((p) => { const n = new Set(p); n.delete(pageId); return n; });
			} else {
				setAdded((p) => new Set([...p, pageId]));
			}
		}
	};

	const handleSave = async () => {
		if (!directorate) return;
		if (added.size === 0 && removed.size === 0) {
			onClose();
			return;
		}
		setIsSaving(true);
		try {
			await Promise.all([
				...[...added].map((pageId) =>
					linkDirectorateToPage(pageId, directorate.id),
				),
				...[...removed].map((pageId) =>
					unlinkDirectorateFromPage(pageId, directorate.id),
				),
			]);
			qc.invalidateQueries({ queryKey: ["page-directorates-all"] });
			toast.success("Page assignments saved");
			onClose();
		} catch {
			toast.error("Failed to save assignments");
		} finally {
			setIsSaving(false);
		}
	};

	const filtered = allPages.filter((p) =>
		p.title.toLowerCase().includes(search.toLowerCase()),
	);

	const isLoading = pagesLoading || linksLoading;

	return (
		<Dialog open={!!directorate} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="bg-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Link2 className="h-4 w-4 text-indigo-600" />
						Assign to Pages
					</DialogTitle>
					<DialogDescription>
						Select which pages{" "}
						<span className="font-semibold text-slate-800">
							"{directorate?.name}"
						</span>{" "}
						should appear on.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 py-1">
					<Input
						placeholder="Search pages..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="bg-white"
					/>

					<div className="max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white divide-y divide-slate-100">
						{isLoading ? (
							<div className="flex items-center justify-center py-10 text-slate-400">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</div>
						) : filtered.length === 0 ? (
							<p className="py-10 text-center text-sm text-slate-400">
								No pages found
							</p>
						) : (
							filtered.map((page) => (
								<label
									key={page.id}
									className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50"
								>
									<Checkbox
										checked={isChecked(page.id)}
										onCheckedChange={() => toggle(page.id)}
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-slate-800">
											{page.title}
										</p>
										<p className="text-xs text-slate-400">
											/{page.slug}
										</p>
									</div>
									<span
										className={`rounded-full px-2 py-0.5 text-xs font-medium ${
											page.status === "published"
												? "bg-green-50 text-green-700"
												: "bg-slate-100 text-slate-500"
										}`}
									>
										{page.status}
									</span>
								</label>
							))
						)}
					</div>

					<p className="text-xs text-slate-500">
						{selectedCount} page{selectedCount !== 1 ? "s" : ""} selected
					</p>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						className="bg-indigo-600 hover:bg-indigo-700"
						onClick={handleSave}
						disabled={isSaving || isLoading}
					>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							"Save Assignments"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DirectoratesPage() {
	const {
		data: directorates,
		isLoading,
		isError,
		allDesignations,
		allDepartments,
		create,
		update,
		remove,
	} = useDirectorates();

	const [search, setSearch] = useState("");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingDir, setEditingDir] = useState<Directorate | null>(null);
	const [deletingDir, setDeletingDir] = useState<Directorate | null>(null);
	const [assigningDir, setAssigningDir] = useState<Directorate | null>(null);

	const filtered = (directorates ?? []).filter((d) =>
		d.name.toLowerCase().includes(search.toLowerCase()),
	);

	const handleCreate = (data: CreateDirectorateDTO) => {
		create.mutate(data, {
			onSuccess: () => {
				toast.success("Directorate created");
				setIsFormOpen(false);
			},
			onError: () => toast.error("Failed to create directorate"),
		});
	};

	const handleUpdate = (data: CreateDirectorateDTO) => {
		if (!editingDir) return;
		update.mutate(
			{ id: editingDir.id, data },
			{
				onSuccess: () => {
					toast.success("Directorate updated");
					setEditingDir(null);
					setIsFormOpen(false);
				},
				onError: () => toast.error("Failed to update directorate"),
			},
		);
	};

	const handleDelete = () => {
		if (!deletingDir) return;
		remove.mutate(deletingDir.id, {
			onSuccess: () => {
				toast.success("Directorate deleted");
				setDeletingDir(null);
			},
			onError: () => toast.error("Failed to delete directorate"),
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="flex items-center gap-2 text-slate-400 animate-pulse font-medium">
					<Loader2 className="h-5 w-5 animate-spin" />
					Loading Directorates...
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<p className="text-red-500 font-medium">
					Failed to load directorates. Please refresh the page.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="mx-auto w-full max-w-5xl space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
							<Users className="h-6 w-6 text-indigo-600" />
							Directorates
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Manage faculty and staff profiles.
						</p>
					</div>
					<Button
						onClick={() => {
							setEditingDir(null);
							setIsFormOpen(true);
						}}
						className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm self-start sm:self-auto"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Directorate
					</Button>
				</div>

				{/* Search + count */}
				<div className="flex items-center gap-3">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
						<Input
							placeholder="Search directorates..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 bg-white border-slate-200"
						/>
						{search && (
							<button
								onClick={() => setSearch("")}
								className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>
					<span className="text-xs rounded-full px-3 py-1 bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
						{directorates?.length ?? 0} total
					</span>
				</div>

				{/* Table */}
				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
					{/* Header row */}
					<div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-1">Photo</div>
						<div className="col-span-3">Name</div>
						<div className="col-span-3">Designations</div>
						<div className="col-span-2">Department</div>
						<div className="col-span-1 text-center">Active</div>
						<div className="col-span-2 text-right">Actions</div>
					</div>

					{/* Rows */}
					<div className="divide-y divide-slate-100">
						{filtered.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-slate-400">
								<Users className="h-10 w-10 mb-3 opacity-30" />
								<p className="font-medium">
									{search
										? "No directorates match your search."
										: "No directorates yet."}
								</p>
								{!search && (
									<p className="text-sm mt-1">
										Click "Add Directorate" to create your
										first one.
									</p>
								)}
							</div>
						) : (
							filtered.map((dir) => (
								<div
									key={dir.id}
									className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
								>
									{/* Photo */}
									<div className="col-span-1">
										{dir.photo?.url ? (
											<img
												src={resolveUrl(dir.photo.url)}
												alt={dir.name}
												className="h-9 w-9 rounded-full object-cover border border-slate-200"
											/>
										) : (
											<div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
												<Users className="h-4 w-4 text-slate-300" />
											</div>
										)}
									</div>

									{/* Name */}
									<div className="col-span-3">
										<p className="text-sm font-medium text-slate-800">
											{dir.name}
										</p>
										<p className="text-xs text-slate-400 mt-0.5">
											ID: {dir.id}
										</p>
									</div>

									{/* Designations */}
									<div className="col-span-3 flex flex-wrap gap-1">
										{dir.designations.length === 0 ? (
											<span className="text-xs text-slate-400">
												—
											</span>
										) : (
											dir.designations
												.slice(0, 2)
												.map((d) => (
													<span
														key={d.designation.id}
														className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-medium text-indigo-700"
													>
														{d.designation.title}
													</span>
												))
										)}
										{dir.designations.length > 2 && (
											<span className="text-xs text-slate-400">
												+{dir.designations.length - 2}
											</span>
										)}
									</div>

									{/* Department */}
									<div className="col-span-2 text-sm text-slate-600">
										{dir.department?.name ?? (
											<span className="text-slate-400">—</span>
										)}
									</div>

									{/* Active */}
									<div className="col-span-1 flex justify-center">
										<span
											className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
												dir.isActive
													? "bg-green-50 text-green-700"
													: "bg-slate-100 text-slate-500"
											}`}
										>
											{dir.isActive ? "Yes" : "No"}
										</span>
									</div>

									{/* Actions */}
									<div className="col-span-2 flex items-center justify-end gap-1">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
											title="Assign to pages"
											onClick={() => setAssigningDir(dir)}
										>
											<Link2 className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
											title="Edit directorate"
											onClick={() => {
												setEditingDir(dir);
												setIsFormOpen(true);
											}}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
											title="Delete directorate"
											onClick={() => setDeletingDir(dir)}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Create / Edit dialog */}
			<DirectorateFormDialog
				isOpen={isFormOpen}
				onOpenChange={(v) => {
					setIsFormOpen(v);
					if (!v) setEditingDir(null);
				}}
				editing={editingDir}
				isPending={create.isPending || update.isPending}
				onSubmit={editingDir ? handleUpdate : handleCreate}
				allDesignations={allDesignations}
				allDepartments={allDepartments}
			/>

			{/* Delete confirm dialog */}
			<DeleteConfirmDialog
				directorate={deletingDir}
				onConfirm={handleDelete}
				onCancel={() => setDeletingDir(null)}
				isPending={remove.isPending}
			/>

			{/* Assign to pages dialog — key remounts on each new directorate, resetting delta state */}
			<AssignPagesDialog
				key={assigningDir?.id ?? "none"}
				directorate={assigningDir}
				onClose={() => setAssigningDir(null)}
			/>
		</>
	);
}
