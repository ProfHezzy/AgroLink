"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Mail, Lock, User, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/api";

/**
 * Register Page Component
 * Handles new user registration with role selection
 * Supports FARMER, BUYER, and RESEARCHER roles
 */
export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        role: "BUYER",
        location: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Handle form input changes
     */
    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Handle registration form submission
     * Sends POST request to /auth/register endpoint
     */
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            // Prepare data for API (exclude confirmPassword)
            const { confirmPassword, ...registerData } = formData;

            // Call backend API
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = { message: await response.text() };
            }

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Store token in localStorage
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on role
            const role = data.user.role;
            if (role === "FARMER") {
                router.push("/dashboard/farmer");
            } else if (role === "BUYER") {
                router.push("/dashboard/buyer");
            } else if (role === "RESEARCHER") {
                router.push("/dashboard/researcher");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-green-950 px-4 py-12">
            <Card className="w-full max-w-lg shadow-xl border-zinc-200 dark:border-zinc-800">
                <CardHeader className="space-y-4 text-center">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="bg-green-600 p-3 rounded-2xl">
                            <Sprout className="h-8 w-8 text-white" />
                        </div>
                    </div>

                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                        Join AgroLink
                    </CardTitle>
                    <CardDescription className="text-base">
                        Create your account and start connecting
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleRegister}>
                    <CardContent className="space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

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
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-medium">
                                I am a...
                            </Label>
                            <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BUYER">🛒 Buyer (Purchase produce)</SelectItem>
                                    <SelectItem value="FARMER">🌾 Farmer (Sell produce)</SelectItem>
                                    <SelectItem value="RESEARCHER">📊 Researcher (Access data)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location Field */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium">
                                Location (Optional)
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="City, Country"
                                    value={formData.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
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
                                    value={formData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        {/* Register Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-medium rounded-lg"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>

                        {/* Login Link */}
                        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
