"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Mail,
    MapPin,
    Camera,
    Save,
    Map,
    Spade
} from "lucide-react";

export default function FarmerGeneralSettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://localhost:3001/auth/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setUser(await res.json());
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) return null;

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">Farm Profile</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage your digital identity and contact information.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <Card className="w-full aspect-square relative flex items-center justify-center border-dashed border-2 bg-zinc-50 dark:bg-zinc-900/50 group overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center space-y-2">
                                <Camera className="h-10 w-10 text-zinc-300 mx-auto group-hover:text-green-500 transition-colors" />
                                <span className="text-xs text-zinc-400 font-bold uppercase tracking-tighter">Upload Logo</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white/10">Change Image</Button>
                        </div>
                    </Card>
                    <p className="text-[10px] text-zinc-400 mt-4 text-center uppercase font-black">Supported: JPG, PNG, WEBP (Max 2MB)</p>
                </div>

                <div className="flex-1 space-y-6">
                    <Card className="border-0 shadow-xl bg-white dark:bg-zinc-900">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Spade className="h-5 w-5 text-green-600" /> Identity Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-zinc-500">Full Farmer Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <Input className="pl-10 h-11" defaultValue={user?.fullName} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-zinc-500">Official Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <Input className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800" value={user?.email} disabled />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-zinc-500">Farm Location / Region</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input className="pl-10 h-11" defaultValue={user?.location || "Oyo State, Nigeria"} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-zinc-500">Farm Description (Bio)</Label>
                                <textarea
                                    className="w-full min-h-[120px] rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-4 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    placeholder="Tell buyers about your agricultural practices..."
                                />
                            </div>

                            <div className="flex justify-end border-t pt-6">
                                <Button className="bg-green-600 hover:bg-green-700 shadow-md h-11 px-8">
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
