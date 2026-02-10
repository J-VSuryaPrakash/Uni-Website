import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
		<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#eef2ff_0%,_#f8fafc_55%)]">
			<div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
			<div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-100/50 blur-3xl" />
			<div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
				<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur">
					<div className="text-center">
						<p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
							Admin access
						</p>
						<h1 className="mt-3 text-2xl font-semibold text-slate-900">
							Welcome back
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							Sign in to manage the Universitywebsite admin
							pannel.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="mt-8 space-y-5">
						<div className="space-y-2">
							<Label htmlFor="loginEmail">Email</Label>
							<Input
								id="loginEmail"
								type="email"
								placeholder="admin@university.edu"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="transition focus-visible:ring-slate-300"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="loginPassword">Password</Label>
							<Input
								id="loginPassword"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="transition focus-visible:ring-slate-300"
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full bg-slate-900 text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
							disabled={login.isPending}
						>
							{login.isPending ? "Logging in..." : "Sign in"}
						</Button>

						{login.isError && (
							<p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
								Invalid credentials. Please try again.
							</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
