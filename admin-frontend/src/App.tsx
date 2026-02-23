import { Toaster } from "@/components/ui/sonner";
import ContentBlocks from "@/pages/ContentBlocks";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Login from "@/pages/Login";
import Menu from "@/pages/Menu";
import Pages from "@/pages/Pages";
import PageSections from "@/pages/PageSections";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoutes";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				>
					<Route index element={<DashboardHome />} />
					<Route path="menu" element={<Menu />} />
					<Route path="pages" element={<Pages />} />
					<Route path="page-sections" element={<PageSections />} />
					<Route path="content-blocks" element={<ContentBlocks />} />
				</Route>

				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>

			{/* Toast notifications */}
			<Toaster
				position="bottom-right"
				// richColors
				// closeButton
				expand={false}
				duration={3000}
			/>
		</BrowserRouter>
	);
};

export default App;
