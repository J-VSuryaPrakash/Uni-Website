import {
	Bell,
	Blocks,
	Building2,
	LayoutGrid,
	LogOut,
	Menu,
	PanelsTopLeft,
	Shapes,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
	{ label: "Dashboard", to: "/", icon: LayoutGrid },
	{ label: "Menu", to: "/menu", icon: Menu },
	{ label: "Pages", to: "/pages", icon: PanelsTopLeft },
	{ label: "Page Sections", to: "/page-sections", icon: Shapes },
	{ label: "Content Blocks", to: "/content-blocks", icon: Blocks },
	{ label: "Notifications", to: "/notifications", icon: Bell },
	{ label: "Departments", to: "/departments", icon: Building2 },
];

export default function Dashboard() {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout.mutate(undefined, {
			onSuccess: () => navigate("/login"),
		});
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
				<aside className="flex w-full flex-col border-b border-slate-200 bg-white px-5 py-6 lg:h-screen lg:w-[20%] lg:min-w-[240px] lg:max-w-[280px] lg:border-b-0 lg:border-r lg:sticky lg:top-0">
					<div className="px-2">
						<p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
							Admin console
						</p>
						<h1 className="mt-2 text-lg font-semibold text-slate-900">
							University website admin pannel
						</h1>
					</div>

					<nav className="mt-10 flex flex-1 flex-col justify-center gap-2 px-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<NavLink
									key={item.to}
									to={item.to}
									end={item.to === "/"}
									className={({ isActive }) =>
										[
											"flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
											isActive
												? "bg-slate-900 text-white shadow"
												: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
										].join(" ")
									}
								>
									<Icon className="h-4 w-4" />
									{item.label}
								</NavLink>
							);
						})}
					</nav>

					<div className="mt-8 px-2">
						<Button
							variant="outline"
							className="w-full justify-between border-slate-200 text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100"
							onClick={handleLogout}
							disabled={logout.isPending}
						>
							{logout.isPending ? "Signing out..." : "Logout"}
							<LogOut className="h-4 w-4" />
						</Button>
					</div>
				</aside>

				<main className="flex-1 bg-slate-50/60 px-6 py-8 lg:px-10">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
