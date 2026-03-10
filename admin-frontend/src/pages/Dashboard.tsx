import {
	Bell,
	Building2,
	LayoutDashboard,
	Layers,
	LogOut,
	Tag,
	Users,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
	{ label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
	{ label: "Content", to: "/content", icon: Layers, end: false },
	{ label: "Notifications", to: "/notifications", icon: Bell, end: false },
	{ label: "Departments", to: "/departments", icon: Building2, end: false },
	{ label: "Designations", to: "/designations", icon: Tag, end: false },
	{ label: "Directorates", to: "/directorates", icon: Users, end: false },
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
				{/* Sidebar */}
				<aside className="flex w-full flex-col border-b border-slate-200 bg-white px-3 py-4 lg:h-screen lg:w-52 lg:min-w-[208px] lg:max-w-[208px] lg:border-b-0 lg:border-r lg:sticky lg:top-0">
					{/* Brand */}
					<div className="px-2 pb-4 border-b border-slate-100">
						<p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
							Admin Console
						</p>
						<h1 className="mt-1 text-sm font-semibold text-slate-900 leading-snug">
							JNTUK Website
						</h1>
					</div>

					{/* Navigation */}
					<nav className="mt-3 flex flex-1 flex-col gap-0.5 px-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<NavLink
									key={item.to}
									to={item.to}
									end={item.end}
									className={({ isActive }) =>
										[
											"flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
											isActive
												? "bg-slate-900 text-white"
												: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
										].join(" ")
									}
								>
									<Icon className="h-4 w-4 shrink-0" />
									{item.label}
								</NavLink>
							);
						})}
					</nav>

					{/* Logout */}
					<div className="mt-3 pt-3 border-t border-slate-100 px-1">
						<Button
							variant="ghost"
							className="w-full justify-start gap-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 px-2.5 py-2 h-auto text-sm font-medium"
							onClick={handleLogout}
							disabled={logout.isPending}
						>
							<LogOut className="h-4 w-4 shrink-0" />
							{logout.isPending ? "Signing out..." : "Logout"}
						</Button>
					</div>
				</aside>

				{/* Main content */}
				<main className="flex-1 bg-slate-50 px-6 py-7 lg:px-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
