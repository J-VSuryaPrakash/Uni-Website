import {
	ArrowRight,
	Bell,
	FileText,
	Layers,
	LayoutGrid,
	Users,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useMenus } from "@/hooks/useMenus";
import { usePages } from "@/hooks/usePage";
import type { Menu } from "@/types/Menu.types";
import type { Page } from "@/types/Page.types";

export default function DashboardHome() {
	const { data: menus, isLoading: menusLoading } = useMenus();
	const { data: pages, isLoading: pagesLoading } = usePages();

	const sortedMenus = useMemo(() => {
		return (menus ?? []).slice().sort((a, b) => a.position - b.position);
	}, [menus]);

	const sortedPages = useMemo(() => {
		return (pages ?? []).slice().sort((a, b) => a.position - b.position);
	}, [pages]);

	const pagesByMenu = useMemo(() => {
		const map = new Map<number, Page[]>();
		for (const page of sortedPages) {
			if (page.menuId == null) continue;
			const list = map.get(page.menuId) ?? [];
			list.push(page);
			map.set(page.menuId, list);
		}
		return map;
	}, [sortedPages]);

	const unassignedPages = useMemo(
		() => sortedPages.filter((p) => p.menuId == null),
		[sortedPages],
	);

	if (menusLoading || pagesLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<span className="text-sm text-slate-400 animate-pulse">
					Loading dashboard...
				</span>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			{/* Stats row */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{[
					{
						icon: LayoutGrid,
						label: "Menus",
						value: sortedMenus.length,
						to: "/content",
					},
					{
						icon: FileText,
						label: "Pages",
						value: sortedPages.length,
						to: "/content",
					},
					{
						icon: Bell,
						label: "Notifications",
						value: null,
						to: "/notifications",
					},
					{
						icon: Users,
						label: "Directorates",
						value: null,
						to: "/directorates",
					},
				].map(({ icon: Icon, label, value, to }) => (
					<Link
						key={label}
						to={to}
						className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-slate-300 hover:shadow-sm transition-all group"
					>
						<div className="rounded-lg bg-slate-100 p-2 group-hover:bg-slate-200 transition-colors shrink-0">
							<Icon className="h-4 w-4 text-slate-600" />
						</div>
						<div className="min-w-0">
							<p className="text-xs text-slate-500">{label}</p>
							<p className="text-lg font-semibold text-slate-900">
								{value !== null ? value : "→"}
							</p>
						</div>
					</Link>
				))}
			</div>

			{/* Quick actions */}
			<div className="rounded-xl border border-slate-200 bg-white p-5">
				<p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
					Quick actions
				</p>
				<div className="flex flex-wrap gap-2">
					<Button
						asChild
						size="sm"
						className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
					>
						<Link to="/content">
							<Layers size={14} /> Manage Content
						</Link>
					</Button>
					<Button
						asChild
						size="sm"
						variant="outline"
						className="gap-1.5"
					>
						<Link to="/notifications">
							<Bell size={14} /> Add Notification
						</Link>
					</Button>
					<Button
						asChild
						size="sm"
						variant="outline"
						className="gap-1.5"
					>
						<Link to="/directorates">
							<Users size={14} /> Manage Staff
						</Link>
					</Button>
				</div>
			</div>

			{/* Menu overview */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-semibold text-slate-900">
						Content overview
					</h2>
					<Link
						to="/content"
						className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
					>
						Manage all <ArrowRight size={12} />
					</Link>
				</div>

				{sortedMenus.length === 0 ? (
					<div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
						No menus created yet.{" "}
						<Link
							to="/content"
							className="text-slate-700 underline underline-offset-2"
						>
							Get started
						</Link>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2">
						{sortedMenus.map((menu: Menu) => {
							const menuPages =
								pagesByMenu.get(menu.id) ?? [];
							const visible = menuPages.slice(0, 4);
							const remaining =
								menuPages.length - visible.length;

							return (
								<div
									key={menu.id}
									className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all"
								>
									{/* Menu header */}
									<div className="flex items-center justify-between mb-3">
										<div className="min-w-0">
											<Link
												to={`/content/${menu.id}`}
												className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-1.5"
											>
												{menu.name}
												<ArrowRight
													size={12}
													className="shrink-0"
												/>
											</Link>
											<span className="text-xs text-slate-400 font-mono">
												/{menu.slug}
											</span>
										</div>
										<span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 shrink-0 ml-2">
											{menuPages.length} page
											{menuPages.length !== 1
												? "s"
												: ""}
										</span>
									</div>

									{/* Page list */}
									{menuPages.length === 0 ? (
										<p className="text-xs text-slate-400 italic">
											No pages yet.{" "}
											<Link
												to={`/content/${menu.id}`}
												className="text-slate-600 not-italic hover:underline"
											>
												Add one
											</Link>
										</p>
									) : (
										<div className="space-y-1">
											{visible.map((page) => (
												<div
													key={page.id}
													className="flex items-center gap-1.5 text-xs text-slate-500"
												>
													<FileText
														size={11}
														className="text-slate-300 shrink-0"
													/>
													<Link
														to={`/content/${menu.id}/${page.id}`}
														className="truncate hover:text-slate-800 transition-colors"
													>
														{page.title}
													</Link>
												</div>
											))}
											{remaining > 0 && (
												<Link
													to={`/content/${menu.id}`}
													className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
												>
													+{remaining} more
												</Link>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Unassigned pages */}
			{unassignedPages.length > 0 && (
				<div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
					<p className="text-sm font-medium text-amber-800 mb-2">
						{unassignedPages.length} page
						{unassignedPages.length !== 1 ? "s" : ""} not
						assigned to any menu
					</p>
					<div className="flex flex-wrap gap-2">
						{unassignedPages.map((page) => (
							<Link
								key={page.id}
								to="/content"
								className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-md px-2 py-1 transition-colors"
							>
								<FileText size={11} />
								{page.title}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
