import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Page } from "@/types/Page.types";
import type { PageSection } from "@/types/PageSection.types";

interface ContentBlocksHeaderProps {
	pageOptions: Page[];
	sectionOptions: PageSection[];
	selectedPageId: number | null;
	selectedSectionId: number | null;
	searchQuery: string;
	onPageChange: (id: number | null) => void;
	onSectionChange: (id: number | null) => void;
	onSearchChange: (value: string) => void;
	onAdd: () => void;
	disableSectionSelect: boolean;
	disableSearch: boolean;
	disableAdd: boolean;
}

export default function ContentBlocksHeader({
	pageOptions,
	sectionOptions,
	selectedPageId,
	selectedSectionId,
	searchQuery,
	onPageChange,
	onSectionChange,
	onSearchChange,
	onAdd,
	disableSectionSelect,
	disableSearch,
	disableAdd,
}: ContentBlocksHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-slate-900">
					Content Blocks
				</h1>
				<p className="text-sm text-slate-500">
					Manage content blocks for a page section.
				</p>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="w-full sm:w-64">
					<Select
						value={selectedPageId ? String(selectedPageId) : ""}
						onValueChange={(value) => {
							const id = value ? Number(value) : null;
							onPageChange(id);
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a page" />
						</SelectTrigger>
						<SelectContent>
							{pageOptions.map((page) => (
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

				<div className="w-full sm:w-64">
					<Select
						value={
							selectedSectionId ? String(selectedSectionId) : ""
						}
						onValueChange={(value) => {
							const id = value ? Number(value) : null;
							onSectionChange(id);
						}}
						disabled={disableSectionSelect}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a section" />
						</SelectTrigger>
						<SelectContent>
							{sectionOptions.map((section) => (
								<SelectItem
									key={section.id}
									value={String(section.id)}
								>
									{section.title || `Section ${section.id}`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
					<Input
						placeholder="Search blocks..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full sm:w-64 pl-9 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
						disabled={disableSearch}
					/>
				</div>

				<Button
					onClick={onAdd}
					className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all"
					disabled={disableAdd}
				>
					<Plus className="mr-2 h-4 w-4" /> Add Block
				</Button>
			</div>
		</div>
	);
}
