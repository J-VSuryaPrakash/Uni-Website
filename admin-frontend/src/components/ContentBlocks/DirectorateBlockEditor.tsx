import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search, Trash2, Users } from "lucide-react";

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

interface Props {
	title: string;
	selectedIds: number[];
	onTitleChange: (title: string) => void;
	onSelectedIdsChange: (ids: number[]) => void;
}

export default function DirectorateBlockEditor({
	title,
	selectedIds,
	onTitleChange,
	onSelectedIdsChange,
}: Props) {
	const { data: directorates, allDepartments } = useDirectorates();
	const [searchQuery, setSearchQuery] = useState("");
	const [departmentFilter, setDepartmentFilter] = useState<string>("all");

	const allDirectorates = directorates ?? [];

	// Directorates available to add (not already selected)
	const filteredDirectorates = useMemo(() => {
		const selectedSet = new Set(selectedIds);
		let list = allDirectorates.filter((d) => !selectedSet.has(d.id));

		if (departmentFilter !== "all") {
			const deptId = Number(departmentFilter);
			list = list.filter((d) => d.department?.id === deptId);
		}

		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			list = list.filter(
				(d) =>
					d.name.toLowerCase().includes(q) ||
					d.department?.name?.toLowerCase().includes(q) ||
					d.designations.some((des) =>
						des.designation.title.toLowerCase().includes(q),
					),
			);
		}

		return list;
	}, [allDirectorates, selectedIds, departmentFilter, searchQuery]);

	// Selected directorates in order
	const selectedDirectorates = useMemo(() => {
		const map = new Map(allDirectorates.map((d) => [d.id, d]));
		return selectedIds
			.map((id) => map.get(id))
			.filter((d): d is NonNullable<typeof d> => d != null);
	}, [allDirectorates, selectedIds]);

	const addDirectorate = (id: number) => {
		onSelectedIdsChange([...selectedIds, id]);
	};

	const removeDirectorate = (id: number) => {
		onSelectedIdsChange(selectedIds.filter((sid) => sid !== id));
	};

	const moveUp = (index: number) => {
		if (index === 0) return;
		const updated = [...selectedIds];
		[updated[index - 1], updated[index]] = [
			updated[index],
			updated[index - 1],
		];
		onSelectedIdsChange(updated);
	};

	const moveDown = (index: number) => {
		if (index === selectedIds.length - 1) return;
		const updated = [...selectedIds];
		[updated[index], updated[index + 1]] = [
			updated[index + 1],
			updated[index],
		];
		onSelectedIdsChange(updated);
	};

	return (
		<div className="grid gap-4">
			{/* Title */}
			<div className="grid gap-1.5">
				<Label htmlFor="directorateTitle">
					Heading (optional)
				</Label>
				<Input
					id="directorateTitle"
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder="e.g. Additional Controller of Examination 1"
				/>
			</div>

			{/* Selected directorates */}
			{selectedDirectorates.length > 0 && (
				<div className="grid gap-1.5">
					<Label className="text-xs uppercase tracking-wide text-slate-500">
						Selected ({selectedDirectorates.length})
					</Label>
					<div className="space-y-1">
						{selectedDirectorates.map((d, index) => (
							<div
								key={d.id}
								className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/60"
							>
								<span className="text-xs font-semibold text-slate-400 w-5 text-center shrink-0">
									{index + 1}
								</span>
								<div className="flex-1 min-w-0">
									<span className="text-sm font-medium text-slate-800 truncate block">
										{d.name}
									</span>
									{d.department?.name && (
										<span className="text-xs text-slate-500">
											{d.department.name}
										</span>
									)}
								</div>
								<div
									className="flex items-center gap-0.5 shrink-0"
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
										disabled={
											index ===
											selectedDirectorates.length - 1
										}
										title="Move down"
										className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
									>
										<ChevronDown className="h-3.5 w-3.5" />
									</button>
									<button
										type="button"
										onClick={() =>
											removeDirectorate(d.id)
										}
										title="Remove"
										className="p-1 text-red-400 hover:text-red-600"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Search & filter to add */}
			<div className="grid gap-1.5">
				<Label className="text-xs uppercase tracking-wide text-slate-500">
					Add Directorates
				</Label>
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
						<Input
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by name..."
							className="h-8 pl-8 text-sm"
						/>
					</div>
					<Select
						value={departmentFilter}
						onValueChange={setDepartmentFilter}
					>
						<SelectTrigger className="h-8 w-44 text-sm">
							<SelectValue placeholder="All departments" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All departments
							</SelectItem>
							{allDepartments.map((dept) => (
								<SelectItem
									key={dept.id}
									value={String(dept.id)}
								>
									{dept.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Dropdown list */}
				<div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white">
					{filteredDirectorates.length === 0 ? (
						<div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
							<Users className="h-4 w-4" />
							{allDirectorates.length === 0
								? "No directorates found"
								: "No matching directorates"}
						</div>
					) : (
						filteredDirectorates.map((d) => (
							<button
								key={d.id}
								type="button"
								onClick={() => addDirectorate(d.id)}
								className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-b-0"
							>
								<div className="flex-1 min-w-0">
									<span className="text-sm font-medium text-slate-800 truncate block">
										{d.name}
									</span>
									<span className="text-xs text-slate-500">
										{[
											d.designations
												.map(
													(des) =>
														des.designation.title,
												)
												.join(", "),
											d.department?.name,
										]
											.filter(Boolean)
											.join(" - ")}
									</span>
								</div>
								<span className="text-xs text-indigo-500 font-medium shrink-0">
									+ Add
								</span>
							</button>
						))
					)}
				</div>
			</div>
		</div>
	);
}
