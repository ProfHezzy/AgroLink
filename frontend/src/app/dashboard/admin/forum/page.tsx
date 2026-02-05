"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MessageSquare,
    Flag,
    Trash2,
    ShieldAlert,
    Filter,
    Search,
    CheckCircle,
    AlertCircle,
    Lock
} from "lucide-react";

export default function ForumModerationPage() {
    const [threads, setThreads] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const [threadsRes, statsRes] = await Promise.all([
                fetch("http://localhost:3001/forum/threads"),
                fetch("http://localhost:3001/forum/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (threadsRes.ok) setThreads(await threadsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error("Failed to fetch forum data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteThread = async (id: string) => {
        if (!confirm("Are you sure you want to delete this thread?")) return;
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`http://localhost:3001/forum/threads/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setThreads(threads.filter(t => t.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const filteredThreads = threads.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Forum Moderation</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Review flagged content, manage categories, and handle community reports.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" className="border-red-600 text-red-600 bg-red-50 hover:bg-red-100">
                        <Lock className="mr-2 h-4 w-4" />
                        Platform Lockdown
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Active Discussions</CardTitle>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        placeholder="Search threads..."
                                        className="pl-9 h-8 w-48 text-xs"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="animate-pulse space-y-4">
                                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />)}
                                    </div>
                                ) : filteredThreads.length > 0 ? (
                                    filteredThreads.map((thread) => (
                                        <div key={thread.id} className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 rounded-lg group">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                                    <MessageSquare className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold">{thread.title}</h4>
                                                    <div className="flex items-center space-x-2 mt-0.5">
                                                        <span className="text-[10px] text-zinc-400">by {thread.author?.fullName}</span>
                                                        <span className="text-[10px] text-zinc-400">• {thread._count?.comments || 0} comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteThread(thread.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-8 text-zinc-500">No discussions found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center">
                                <ShieldAlert className="h-4 w-4 mr-2 text-red-500" /> Forum Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500 font-medium">Threads</span>
                                <span className="font-bold">{stats?.totalThreads || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500 font-medium">Comments</span>
                                <span className="font-bold">{stats?.totalComments || 0}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white text-sm">Community Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <p className="text-[10px] text-zinc-400">Profanity filter is currently **Active** with moderate sensitivity.</p>
                            </div>
                            <Button variant="outline" className="w-full h-8 text-xs font-bold uppercase border-zinc-700 text-white hover:bg-zinc-800 mt-2">Update Guidelines</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
