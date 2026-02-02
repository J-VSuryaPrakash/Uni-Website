import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		login.mutate(
			{ email, password },
			{
				onSuccess: () => {
					navigate("/menu");
				},
				onError: (error: any) => {
					// ADD THIS TO SEE THE ACTUAL ERROR IN CONSOLE
					console.error(
						"Login failed:",
						error.response?.data || error.message,
					);
				},
			},
		);
	};

	return (
		<div className="h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow w-96"
			>
				<h1 className="text-xl font-semibold mb-4">Admin Login</h1>

				<input
					type="email"
					placeholder="Email"
					className="w-full border p-2 mb-3"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					type="password"
					placeholder="Password"
					className="w-full border p-2 mb-4"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<button
					type="submit"
					className="w-full bg-black text-white py-2"
					disabled={login.isPending}
				>
					{login.isPending ? "Logging in..." : "Login"}
				</button>

				{login.isError && (
					<p className="text-red-600 mt-2">Invalid credentials</p>
				)}
			</form>
		</div>
	);
}
