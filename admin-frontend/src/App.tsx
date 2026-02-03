import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/common/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Pages from "./pages/Pages";
import PageEditor from "./pages/PageEditor";

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
					<Route path="menu" element={<Menu />} />
					<Route path="pages" element={<Pages />} />
					<Route path="pages/:id/editor" element={<PageEditor />} />
				</Route>

				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>

			{/* Toast notifications */}
			<Toaster
				position="top-right"
				// richColors
				// closeButton
				expand={false}
				duration={3000}
			/>
		</BrowserRouter>
	);
};

export default App;
