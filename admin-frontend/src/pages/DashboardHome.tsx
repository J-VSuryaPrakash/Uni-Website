import { ArrowUpRight, FileText, Layers } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useMenus } from "@/hooks/useMenus";
import { usePages } from "@/hooks/usePage";
import type { Menu } from "@/types/Menu.types";
import type { Page } from "@/types/Page.types";

const buildPagePreview = (pages: Page[]) => {
	const maxItems = 5;
	const visible = pages.slice(0, maxItems);
	const remaining = pages.length - visible.length;
	return { visible, remaining };
};

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

	const unassignedPages = useMemo(() => {
		return sortedPages.filter((page) => page.menuId == null);
	}, [sortedPages]);

	const menuCount = sortedMenus.length;
	const pageCount = sortedPages.length;

	if (menusLoading || pagesLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-slate-400 animate-pulse font-medium">
					Loading dashboard...
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
			<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
							Admin overview
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-slate-900">
							Content structure summary
						</h2>
						<p className="text-sm text-slate-600">
							Review menus and the pages assigned to each menu.
						</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="rounded-2xl border border-slate-200 px-4 py-3 text-center">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
								Menus
							</p>
							<p className="mt-1 text-2xl font-semibold text-slate-900">
								{menuCount}
							</p>
						</div>
						<div className="rounded-2xl border border-slate-200 px-4 py-3 text-center">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
								Pages
							</p>
							<p className="mt-1 text-2xl font-semibold text-slate-900">
								{pageCount}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold text-slate-900">
						Menus and pages
					</h3>
					<Link
						to="/menu"
						className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-slate-900"
					>
						Manage menus
						<ArrowUpRight className="h-4 w-4" />
					</Link>
				</div>

				<div className="grid gap-4 lg:grid-cols-2">
					{sortedMenus.length === 0 ? (
						<div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
							No menus created yet.
						</div>
					) : (
						sortedMenus.map((menu: Menu) => {
							const menuPages = pagesByMenu.get(menu.id) ?? [];
							const { visible, remaining } =
								buildPagePreview(menuPages);
							return (
								<div
									key={menu.id}
									className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
												Menu
											</p>
											<Link
												to="/menu"
												className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-slate-900 transition hover:text-slate-700"
											>
												{menu.name}
												<ArrowUpRight className="h-4 w-4" />
											</Link>
											<p className="text-xs text-slate-500">
												/{menu.slug}
											</p>
										</div>
										<div className="rounded-2xl border border-slate-200 px-3 py-2 text-center">
											<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
												Pages
											</p>
											<p className="mt-1 text-xl font-semibold text-slate-900">
												{menuPages.length}
											</p>
										</div>
									</div>

									<div className="mt-4 space-y-2">
										{menuPages.length === 0 ? (
											<p className="text-sm text-slate-500">
												No pages assigned yet.
											</p>
										) : (
											visible.map((page) => (
												<div
													key={page.id}
													className="flex items-center gap-2 text-sm text-slate-700"
												>
													<FileText className="h-4 w-4 text-slate-400" />
													<Link
														to="/pages"
														className="truncate transition hover:text-slate-900"
													>
														{page.title}
													</Link>
												</div>
											))
										)}
										{remaining > 0 ? (
											<p className="text-xs text-slate-500">
												and {remaining} more
											</p>
										) : null}
									</div>
								</div>
							);
						})
					)}
				</div>
			</section>

			<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex items-center justify-between">
					<div>
						<h4 className="text-lg font-semibold text-slate-900">
							Pages without a menu
						</h4>
						<p className="text-sm text-slate-500">
							These pages are not grouped under any menu yet.
						</p>
					</div>
					<Link
						to="/pages"
						className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-slate-900"
					>
						Go to pages
						<ArrowUpRight className="h-4 w-4" />
					</Link>
				</div>

				{unassignedPages.length === 0 ? (
					<p className="mt-4 text-sm text-slate-500">
						All pages are assigned to menus.
					</p>
				) : (
					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						{unassignedPages.map((page) => (
							<div
								key={page.id}
								className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
							>
								<Layers className="h-4 w-4 text-slate-400" />
								<Link
									to="/pages"
									className="truncate transition hover:text-slate-900"
								>
									{page.title}
								</Link>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
