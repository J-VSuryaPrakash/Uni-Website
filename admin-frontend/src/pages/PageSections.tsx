import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import type { Page } from "@/types/Page.types";
import type { PageSection } from "@/types/PageSection.types";
import { usePages } from "../hooks/usePage";
import { usePageSections } from "../hooks/usePageSections";

interface SectionFormState {
	title: string;
	position: number;
}

export default function PageSections() {
	const { data: pages } = usePages();
	const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
	const {
		data: sections,
		isLoading,
		create,
		update,
		remove,
		reorder,
	} = usePageSections(selectedPageId);

	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [editingSection, setEditingSection] = useState<PageSection | null>(
		null,
	);
	const [deleteSectionId, setDeleteSectionId] = useState<number | null>(null);
	const [formState, setFormState] = useState<SectionFormState>({
		title: "",
		position: 0,
	});

	useEffect(() => {
		if (!selectedPageId && pages && pages.length > 0) {
			setSelectedPageId(pages[0].id);
		}
	}, [pages, selectedPageId]);

	const pageOptions = useMemo(() => pages ?? [], [pages]);
	const activePage = useMemo(() => {
		return pageOptions.find((page) => page.id === selectedPageId) ?? null;
	}, [pageOptions, selectedPageId]);

	const searchValue = searchQuery.trim().toLowerCase();
	const filteredSections = useMemo(() => {
		if (!sections) return [];
		if (!searchValue) return sections;
		return sections.filter((section) => {
			const title = section.title?.toLowerCase() ?? "";
			return (
				title.includes(searchValue) ||
				String(section.id).includes(searchValue)
			);
		});
	}, [sections, searchValue]);

	const buildFormState = (
		section?: PageSection | null,
	): SectionFormState => ({
		title: section?.title ?? "",
		position: section?.position ?? sections?.length ?? 0,
	});

	const clampPosition = (value: number, max: number) => {
		if (Number.isNaN(value)) return 0;
		return Math.max(0, Math.min(value, max));
	};

	const buildReorderPayload = (
		allSections: PageSection[],
		targetSection: PageSection,
		newPosition: number,
		isNewSection: boolean,
	) => {
		const list = [...allSections].sort((a, b) => a.position - b.position);
		const filtered = isNewSection
			? list
			: list.filter((section) => section.id !== targetSection.id);
		const clamped = clampPosition(newPosition, filtered.length);
		filtered.splice(clamped, 0, targetSection);
		return filtered.map((section, index) => ({
			id: section.id,
			position: index,
		}));
	};

	const openCreate = () => {
		setEditingSection(null);
		setFormState(buildFormState(null));
		setIsAddOpen(true);
	};

	const openEdit = (section: PageSection) => {
		setEditingSection(section);
		setFormState(buildFormState(section));
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedPageId) return;

		const payload = {
			title: formState.title.trim() ? formState.title.trim() : undefined,
			position: formState.position,
		};

		if (editingSection) {
			const previousPosition = editingSection.position;
			update.mutate(
				{ id: editingSection.id, data: payload },
				{
					onSuccess: (updatedSection) => {
						toast.success("Section updated successfully");
						if (
							sections &&
							formState.position !== previousPosition
						) {
							const reorderPayload = buildReorderPayload(
								sections,
								updatedSection,
								formState.position,
								false,
							);
							reorder.mutate(reorderPayload, {
								onSuccess: () =>
									toast.success("Section positions updated"),
								onError: (error: any) =>
									toast.error(
										error?.message ||
											"Failed to update positions",
									),
							});
						}
						setEditingSection(null);
					},
					onError: (error: any) => {
						toast.error(
							error?.message || "Failed to update section",
						);
					},
				},
			);
		} else {
			create.mutate(payload, {
				onSuccess: (createdSection) => {
					toast.success("Section created successfully");
					if (sections && formState.position < sections.length) {
						const reorderPayload = buildReorderPayload(
							sections,
							createdSection,
							formState.position,
							true,
						);
						reorder.mutate(reorderPayload, {
							onSuccess: () =>
								toast.success("Section positions updated"),
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
					toast.error(error?.message || "Failed to create section");
				},
			});
		}
	};

	const handleDeleteConfirm = () => {
		if (deleteSectionId === null) return;

		remove.mutate(deleteSectionId, {
			onSuccess: () => {
				toast.success("Section deleted successfully");
				setDeleteSectionId(null);
			},
			onError: (error: any) => {
				toast.error(error?.message || "Failed to delete section");
			},
		});
	};

	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
			<div className="space-y-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900">
							Page Sections
						</h1>
						<p className="text-sm text-slate-500">
							Manage sections for each page without drag and drop.
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="w-full sm:w-64">
							<Select
								value={
									selectedPageId ? String(selectedPageId) : ""
								}
								onValueChange={(value) => {
									const id = value ? Number(value) : null;
									setSelectedPageId(id);
									setSearchQuery("");
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a page" />
								</SelectTrigger>
								<SelectContent>
									{pageOptions.map((page: Page) => (
										<SelectItem
											key={page.id}
											value={String(page.id)}
										>
											{page.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search sections..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full sm:w-64 pl-9 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
								disabled={!selectedPageId}
							/>
						</div>

						<Button
							onClick={openCreate}
							className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all"
							disabled={!selectedPageId}
						>
							<Plus className="mr-2 h-4 w-4" /> Add Section
						</Button>
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
					<div className="grid grid-cols-10 gap-4 border-b border-slate-200 bg-slate-50/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
						<div className="col-span-4">Title</div>
						<div className="col-span-2">ID</div>
						<div className="col-span-2 text-center">Position</div>
						<div className="col-span-2 text-right">Actions</div>
					</div>

					{isLoading ? (
						<div className="p-10 text-center text-slate-500">
							Loading sections...
						</div>
					) : selectedPageId ? (
						<div className="divide-y divide-slate-100">
							{filteredSections.length > 0 ? (
								filteredSections.map((section) => (
									<div
										key={section.id}
										className="grid grid-cols-10 items-center gap-4 p-4 transition-colors hover:bg-slate-50"
									>
										<div className="col-span-4">
											<div className="font-medium text-slate-900 truncate">
												{section.title ||
													"Untitled section"}
											</div>
											{activePage ? (
												<div className="text-xs text-slate-500 truncate">
													{activePage.title}
												</div>
											) : null}
										</div>
										<div className="col-span-2 text-slate-500 text-sm font-mono">
											#{section.id}
										</div>
										<div className="col-span-2 text-center text-slate-500 text-sm">
											{section.position}
										</div>
										<div className="col-span-2 flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													openEdit(section)
												}
												className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
												title="Edit section"
											>
												<Pencil size={16} />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													setDeleteSectionId(
														section.id,
													)
												}
												className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
												title="Delete section"
											>
												<Trash2 size={16} />
											</Button>
										</div>
									</div>
								))
							) : (
								<div className="p-10 text-center text-slate-500">
									No sections found for this page.
								</div>
							)}
						</div>
					) : (
						<div className="p-10 text-center text-slate-500">
							Select a page to view its sections.
						</div>
					)}
				</div>
			</div>

			<Dialog
				open={isAddOpen || !!editingSection}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingSection(null);
					}
				}}
			>
				<DialogContent className="sm:max-w-150 bg-white">
					<DialogHeader>
						<DialogTitle>
							{editingSection ? "Edit Section" : "Create Section"}
						</DialogTitle>
						<DialogDescription>
							{activePage
								? `Page: ${activePage.title}`
								: "Add a new section to this page."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSave} className="grid gap-6 py-4">
						<div className="grid gap-3">
							<Label htmlFor="sectionTitle">Title</Label>
							<Input
								id="sectionTitle"
								name="sectionTitle"
								value={formState.title}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								placeholder="Section title"
							/>
						</div>

						<div className="grid gap-3">
							<Label htmlFor="sectionPosition">Position</Label>
							<Input
								id="sectionPosition"
								name="sectionPosition"
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

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsAddOpen(false);
									setEditingSection(null);
								}}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-indigo-600 hover:bg-indigo-700"
								disabled={create.isPending || update.isPending}
							>
								{create.isPending || update.isPending
									? "Saving..."
									: editingSection
										? "Save Changes"
										: "Create Section"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={deleteSectionId !== null}
				onOpenChange={(open) => !open && setDeleteSectionId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Delete this section?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. The section and its
							content will be removed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={remove.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={remove.isPending}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
						>
							{remove.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
