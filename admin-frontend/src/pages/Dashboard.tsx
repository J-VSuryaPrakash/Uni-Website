import { Outlet } from "react-router-dom";

export default function Dashboard() {
	return (
		<div className="flex">
			<aside className="w-64 h-screen bg-gray-900 text-white p-4">
				Admin Panel
			</aside>
			<main className="flex-1 p-6">
				<Outlet />
			</main>
		</div>
	);
}
