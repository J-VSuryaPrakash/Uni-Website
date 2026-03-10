import { Toaster } from "@/components/ui/sonner";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Departments from "@/pages/Departments";
import Designations from "@/pages/Designations";
import Directorates from "@/pages/Directorates";
import Login from "@/pages/Login";
import Notifications from "@/pages/Notifications";
import ContentHub from "@/pages/content";
import MenuPages from "@/pages/content/MenuPages";
import PageSectionsList from "@/pages/content/PageSectionsList";
import SectionBlocks from "@/pages/content/SectionBlocks";
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

					{/* Unified content management hierarchy */}
					<Route path="content" element={<ContentHub />} />
					<Route path="content/:menuId" element={<MenuPages />} />
					<Route
						path="content/:menuId/:pageId"
						element={<PageSectionsList />}
					/>
					<Route
						path="content/:menuId/:pageId/:sectionId"
						element={<SectionBlocks />}
					/>

					<Route path="notifications" element={<Notifications />} />
					<Route path="departments" element={<Departments />} />
					<Route path="designations" element={<Designations />} />
					<Route path="directorates" element={<Directorates />} />
				</Route>

				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>

			<Toaster position="bottom-right" expand={false} duration={3000} />
		</BrowserRouter>
	);
};

export default App;
