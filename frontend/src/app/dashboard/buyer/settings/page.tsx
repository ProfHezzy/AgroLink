"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Bell,
    Save,
    Loader2,
    Camera,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function BuyerSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        avatar: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:3001/auth/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    bio: data.bio || "",
                    avatar: data.avatar || "",
                });
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg(null);
        setErrorMsg(null);
        try {
            const token = localStorage.getItem("access_token");
            // We need a userId for the update endpoint
            // Usually we can get it from the profile data
            const userRes = await fetch("http://localhost:3001/auth/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const userData = await userRes.json();

            const response = await fetch(`http://localhost:3001/users/${userData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                setSuccessMsg("Profile updated successfully!");
                setTimeout(() => setSuccessMsg(null), 3000);
            } else {
                setErrorMsg("Failed to update profile. Admins only can edit other users, but you should be able to edit yourself if the backend allows it.");
                // Note: My backend UsersController.update has an ADMIN check. I should fix that to allow self-update.
            }
        } catch (error) {
            setErrorMsg("An unexpected error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Accessing profile vault...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Account Settings</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">Manage your personal information and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { label: "Personal Info", icon: User, active: true },
                        { label: "Security", icon: Shield, active: false },
                        { label: "Notifications", icon: Bell, active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${item.active ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:bg-zinc-100'}`}
                        >
                            <item.icon className="h-4 w-4" /> {item.label}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3">
                    <Card className="border-0 shadow-2xl overflow-hidden">
                        <CardHeader className="bg-zinc-50/50 border-b">
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Personal Information</CardTitle>
                            <CardDescription className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Update your identification details.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-3xl bg-zinc-100 overflow-hidden border-2 border-zinc-200">
                                            {profile.avatar ? (
                                                <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-3xl font-black text-zinc-300">
                                                    {profile.fullName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 bg-green-600 text-white h-8 w-8 rounded-xl border-4 border-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Profile Picture</p>
                                </div>

                                {successMsg && (
                                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                        <p className="text-sm font-bold">{successMsg}</p>
                                    </div>
                                )}

                                {errorMsg && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <p className="text-sm font-bold">{errorMsg}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Legal Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input
                                                className="h-12 pl-12 font-bold"
                                                value={profile.fullName}
                                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input
                                                className="h-12 pl-12 font-bold bg-zinc-50"
                                                value={profile.email}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mobile Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input
                                                className="h-12 pl-12 font-bold"
                                                placeholder="+234 ..."
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input
                                                className="h-12 pl-12 font-bold"
                                                placeholder="City, State"
                                                value={profile.location}
                                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Profile Bio</Label>
                                    <textarea
                                        className="w-full min-h-[120px] rounded-2xl border border-zinc-200 p-5 text-sm font-bold focus:ring-2 focus:ring-green-500 focus:outline-none leading-relaxed transition-all"
                                        placeholder="Tell us about yourself..."
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    />
                                </div>

                                <div className="pt-6 border-t">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full h-14 bg-zinc-900 hover:bg-black text-white font-black uppercase tracking-widest shadow-2xl group"
                                    >
                                        {saving ? "Processing Updates..." : <>Save Configuration <Save className="ml-2 h-5 w-5 group-hover:scale-125 transition-transform" /></>}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
