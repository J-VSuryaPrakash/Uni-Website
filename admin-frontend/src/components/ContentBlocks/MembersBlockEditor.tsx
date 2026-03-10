import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Link, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { uploadFile } from "@/api/upload.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { MemberEntry } from "./types";

export const MEMBER_ROLES = [
	"Chairman",
	"Vice Chairman",
	"Member Secretary",
	"Secretary",
	"Director",
	"Dean",
	"Principal",
	"Registrar",
	"Member",
	"Special Invitee",
	"Ex-officio Member",
	"Nominated Member",
] as const;

const emptyMember = (): MemberEntry => ({
	name: "",
	role: "Member",
	photo: "",
	designation: "",
	department: "",
	email: "",
	phone: "",
});

interface Props {
	members: MemberEntry[];
	onChange: (members: MemberEntry[]) => void;
}

export default function MembersBlockEditor({ members, onChange }: Props) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(
		members.length === 0 ? null : 0,
	);
	const [photoMode, setPhotoMode] = useState<Record<number, "upload" | "url">>(
		{},
	);
	const [uploading, setUploading] = useState<Record<number, boolean>>({});
	const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

	const update = (index: number, field: keyof MemberEntry, value: string) => {
		onChange(members.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
	};

	const addMember = () => {
		const updated = [...members, emptyMember()];
		onChange(updated);
		setExpandedIndex(updated.length - 1);
	};

	const removeMember = (index: number) => {
		onChange(members.filter((_, i) => i !== index));
		if (expandedIndex === index) setExpandedIndex(null);
		else if (expandedIndex !== null && expandedIndex > index)
			setExpandedIndex(expandedIndex - 1);
	};

	const moveUp = (index: number) => {
		if (index === 0) return;
		const updated = [...members];
		[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
		onChange(updated);
		setExpandedIndex(index - 1);
	};

	const moveDown = (index: number) => {
		if (index === members.length - 1) return;
		const updated = [...members];
		[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
		onChange(updated);
		setExpandedIndex(index + 1);
	};

	const handleFileUpload = async (index: number, file: File) => {
		setUploading((prev) => ({ ...prev, [index]: true }));
		try {
			const media = await uploadFile(file, "faculty");
			update(index, "photo", media.url);
			toast.success("Photo uploaded");
		} catch {
			toast.error("Failed to upload photo");
		} finally {
			setUploading((prev) => ({ ...prev, [index]: false }));
		}
	};

	const getMode = (index: number) => photoMode[index] ?? "upload";
	const setMode = (index: number, mode: "upload" | "url") =>
		setPhotoMode((prev) => ({ ...prev, [index]: mode }));

	return (
		<div className="space-y-2">
			{members.map((member, index) => (
				<div
					key={index}
					className="border border-slate-200 rounded-lg overflow-hidden"
				>
					{/* ── Collapsed header ── */}
					<div
						className="flex items-center justify-between px-3 py-2.5 bg-slate-50 cursor-pointer select-none"
						onClick={() =>
							setExpandedIndex(expandedIndex === index ? null : index)
						}
					>
						<div className="flex items-center gap-2 min-w-0">
							<span className="text-xs font-semibold text-slate-400 w-5 text-center shrink-0">
								{index + 1}
							</span>
							<div className="min-w-0">
								<span className="text-sm font-medium text-slate-800 truncate block">
									{member.name || "Unnamed Member"}
								</span>
								{member.role && (
									<span className="text-xs text-slate-500">{member.role}</span>
								)}
							</div>
						</div>

						<div
							className="flex items-center gap-1 shrink-0"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								onClick={() => moveUp(index)}
								disabled={index === 0}
								title="Move up"
								className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
							>
								<ChevronUp className="h-3.5 w-3.5" />
							</button>
							<button
								type="button"
								onClick={() => moveDown(index)}
								disabled={index === members.length - 1}
								title="Move down"
								className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
							>
								<ChevronDown className="h-3.5 w-3.5" />
							</button>
							<button
								type="button"
								onClick={() => removeMember(index)}
								title="Remove"
								className="p-1 text-red-400 hover:text-red-600"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>
					</div>

					{/* ── Expanded fields ── */}
					{expandedIndex === index && (
						<div className="px-4 py-4 bg-white grid gap-3">
							{/* Name + Role */}
							<div className="grid grid-cols-2 gap-3">
								<div className="grid gap-1.5">
									<Label className="text-xs">
										Name <span className="text-red-500">*</span>
									</Label>
									<Input
										value={member.name}
										onChange={(e) => update(index, "name", e.target.value)}
										placeholder="Dr. A. Ramakrishna"
										className="h-8 text-sm"
									/>
								</div>
								<div className="grid gap-1.5">
									<Label className="text-xs">
										Role <span className="text-red-500">*</span>
									</Label>
									<Select
										value={member.role}
										onValueChange={(val) => update(index, "role", val)}
									>
										<SelectTrigger className="h-8 text-sm">
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											{MEMBER_ROLES.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Designation + Department */}
							<div className="grid grid-cols-2 gap-3">
								<div className="grid gap-1.5">
									<Label className="text-xs">Designation</Label>
									<Input
										value={member.designation}
										onChange={(e) =>
											update(index, "designation", e.target.value)
										}
										placeholder="Professor, Dept. of CSE"
										className="h-8 text-sm"
									/>
								</div>
								<div className="grid gap-1.5">
									<Label className="text-xs">Department</Label>
									<Input
										value={member.department}
										onChange={(e) =>
											update(index, "department", e.target.value)
										}
										placeholder="Computer Science"
										className="h-8 text-sm"
									/>
								</div>
							</div>

							{/* Photo */}
							<div className="grid gap-1.5">
								<Label className="text-xs">Photo</Label>
								<div className="flex gap-2 mb-1">
									<button
										type="button"
										onClick={() => setMode(index, "upload")}
										className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors ${getMode(index) === "upload" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
									>
										<Upload className="h-3 w-3" />
										Upload file
									</button>
									<button
										type="button"
										onClick={() => setMode(index, "url")}
										className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors ${getMode(index) === "url" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
									>
										<Link className="h-3 w-3" />
										Paste URL
									</button>
								</div>

								{getMode(index) === "upload" ? (
									<div className="flex items-center gap-3">
										<input
											type="file"
											accept="image/*"
											className="hidden"
											ref={(el) => {
												fileRefs.current[index] = el;
											}}
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) handleFileUpload(index, file);
											}}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-8 text-xs"
											disabled={uploading[index]}
											onClick={() => fileRefs.current[index]?.click()}
										>
											{uploading[index] ? "Uploading…" : "Choose photo"}
										</Button>
										{member.photo && !uploading[index] && (
											<span className="text-xs text-green-600">
												✓ Photo set
											</span>
										)}
									</div>
								) : (
									<Input
										value={member.photo}
										onChange={(e) => update(index, "photo", e.target.value)}
										placeholder="https://example.com/photo.jpg"
										className="h-8 text-sm"
									/>
								)}
							</div>

							{/* Email + Phone */}
							<div className="grid grid-cols-2 gap-3">
								<div className="grid gap-1.5">
									<Label className="text-xs">Email</Label>
									<Input
										type="email"
										value={member.email}
										onChange={(e) => update(index, "email", e.target.value)}
										placeholder="name@jntuk.edu.in"
										className="h-8 text-sm"
									/>
								</div>
								<div className="grid gap-1.5">
									<Label className="text-xs">Phone</Label>
									<Input
										value={member.phone}
										onChange={(e) => update(index, "phone", e.target.value)}
										placeholder="+91 9999999999"
										className="h-8 text-sm"
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			))}

			<Button
				type="button"
				variant="outline"
				size="sm"
				className="w-full border-dashed text-slate-600 hover:text-slate-800 hover:border-slate-400"
				onClick={addMember}
			>
				<Plus className="h-3.5 w-3.5 mr-1" />
				Add Member
			</Button>
		</div>
	);
}
