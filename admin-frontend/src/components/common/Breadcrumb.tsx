import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
	label: string;
	to?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
	return (
		<nav
			className="flex items-center gap-1 flex-wrap"
			aria-label="Breadcrumb"
		>
			{items.map((item, i) => {
				const isLast = i === items.length - 1;
				return (
					<div key={i} className="flex items-center gap-1">
						{i > 0 && (
							<ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
						)}
						{isLast || !item.to ? (
							<span
								className={
									isLast
										? "text-sm font-medium text-slate-800"
										: "text-sm text-slate-400"
								}
							>
								{item.label}
							</span>
						) : (
							<Link
								to={item.to}
								className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
							>
								{item.label}
							</Link>
						)}
					</div>
				);
			})}
		</nav>
	);
}
