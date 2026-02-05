"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    TrendingUp,
    Plus,
    Clock,
    User,
    ArrowUpRight,
    Search,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FarmerForumPage() {
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const res = await fetch("http://localhost:3001/forum/threads");
                if (res.ok) setThreads(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchThreads();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Community Forum</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Collaborate with fellow farmers and share agricultural insights.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 shadow-xl border-b-4 border-green-800 active:border-b-0 h-11 transition-all">
                    <Plus className="mr-2 h-5 w-5" /> New Discussion
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm uppercase font-black text-zinc-400 tracking-widest">Ongoing Conversations</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input placeholder="Filter topics..." className="pl-10 h-9 text-xs" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 text-green-500 animate-spin" /></div>
                            ) : threads.length > 0 ? (
                                <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                                    {threads.map((thread) => (
                                        <div key={thread.id} className="p-6 hover:bg-green-50/10 dark:hover:bg-green-950/10 transition-colors group cursor-pointer">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 text-[10px] h-5 px-1 font-black uppercase">Farming Tips</Badge>
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> {new Date(thread.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold group-hover:text-green-600 transition-colors leading-tight">
                                                        {thread.title}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed italic">
                                                        "{thread.content}"
                                                    </p>
                                                    <div className="flex items-center gap-4 pt-2">
                                                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                            <User className="h-4 w-4" />
                                                            {thread.author?.fullName || "Anonymous"}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                            <MessageSquare className="h-4 w-4" />
                                                            {thread._count?.comments || 0} Replies
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="h-12 w-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-green-600 transition-all">
                                                    <ChevronRight className="h-6 w-6 text-zinc-300 group-hover:text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-20 text-zinc-400">No discussions yet. Be the first to start one!</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-900 border-0 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="h-20 w-20 text-white" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-white text-sm uppercase tracking-widest font-black">Top Contributors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs font-bold">#{i}</div>
                                    <div className="flex-1">
                                        <p className="text-xs text-white font-bold">Farmer Hero {i}</p>
                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">{i * 12} Helpful Votes</p>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-600 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase text-zinc-400">Popular Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {["#Irrigation", "#Organic", "#PestControl", "#Harvesting", "#Fertilizers", "#Tractors", "#Livestock"].map(tag => (
                                <Badge key={tag} className="hover:bg-green-600 cursor-pointer bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-0">{tag}</Badge>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
