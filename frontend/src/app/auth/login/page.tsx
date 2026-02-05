"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Mail, Lock, AlertCircle } from "lucide-react";
import { API_URL } from "@/lib/api";

/**
 * Login Page Component
 * Handles user authentication with email and password
 * Communicates with backend API at localhost:3001
 */
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Handle login form submission
     * Sends POST request to /auth/login endpoint
     */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Call backend API
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = { message: await response.text() };
            }

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Store token in localStorage
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on role
            const role = data.user.role;
            if (role === "ADMIN") {
                router.push("/dashboard/admin");
            } else if (role === "FARMER") {
                router.push("/dashboard/farmer");
            } else if (role === "BUYER") {
                router.push("/dashboard/buyer");
            } else if (role === "RESEARCHER") {
                router.push("/dashboard/researcher");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-green-950 px-4 py-12">
            <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800">
                <CardHeader className="space-y-4 text-center">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="bg-green-600 p-3 rounded-2xl">
                            <Sprout className="h-8 w-8 text-white" />
                        </div>
                    </div>

                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-base">
                        Sign in to access your AgroLink account
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        {/* Login Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-medium rounded-lg"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                        {/* Register Link */}
                        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
