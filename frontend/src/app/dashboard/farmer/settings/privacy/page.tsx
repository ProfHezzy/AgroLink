"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Shield,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    Bell,
    Smartphone,
    UserX,
    Trash2
} from "lucide-react";

export default function FarmerPrivacySettingsPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://localhost:3001/auth/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setUser(await res.json());
        };
        fetchProfile();
    }, []);

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Privacy & Security</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage your farm's digital security and data access permissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-lg border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Lock className="h-5 w-5 text-green-600" /> Authentication Credentials
                            </CardTitle>
                            <CardDescription>Update your password to keep your farm data safe.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pr-10"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" placeholder="Min 8 characters" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input type="password" placeholder="Repeat new password" />
                                </div>
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700 shadow-md">Update Password</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Data Privacy</CardTitle>
                            <CardDescription>Control who sees your marketplace activity and farm location.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "Show Shop Location", desc: "Allows buyers to see your farm's physical location on the map.", active: true },
                                { label: "Transaction History Visibility", desc: "Keep your sales volume private from other sellers.", active: false },
                                { label: "Researcher Access", desc: "Allow certified researchers to contact you for agricultural studies.", active: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <div>
                                        <p className="text-sm font-bold">{item.label}</p>
                                        <p className="text-xs text-zinc-500 max-w-[300px]">{item.desc}</p>
                                    </div>
                                    <Button variant={item.active ? "default" : "outline"} size="sm" className={item.active ? "bg-green-100 text-green-700 border-0 hover:bg-green-200" : ""}>
                                        {item.active ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-900 text-white border-0 shadow-xl overflow-hidden">
                        <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" /> Security Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-zinc-400">2FA is Not Enabled</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-zinc-400">Verified Email: {user?.email}</span>
                            </div>
                            <Button variant="outline" className="w-full border-zinc-700 text-xs hover:bg-zinc-800 mt-4">Setup Multi-Factor Auth</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100 dark:border-red-900 shadow-sm border-t-4 border-t-red-500">
                        <CardHeader>
                            <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                                <UserX className="h-4 w-4" /> Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                                Action cannot be undone. All listings and history will be permanently erased.
                            </p>
                            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
                                <Trash2 className="h-3 w-3" /> Deactivate Farm
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
