"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    TrendingUp,
    Plus,
    Clock,
    User,
    ArrowUpRight,
    Search,
    ChevronRight,
    Loader2,
    BookOpen,
    Download,
    Share2
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FarmerResearchPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                const res = await fetch("http://localhost:3001/research");
                if (res.ok) setPosts(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchResearch();
    }, []);

    return (
        <div className="space-y-8 pb-12">
            <div className="relative p-12 rounded-3xl bg-zinc-900 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BookOpen className="h-48 w-48 text-white rotate-12" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-4">
                    <Badge className="bg-green-600 text-white border-0 px-3 py-1 font-black uppercase text-[10px] tracking-widest">Academic Hub</Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">Agricultural Research & Case Studies</h1>
                    <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                        Access cutting-edge data and peer-reviewed journals to optimize your crop yield and farm efficiency.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button className="bg-white text-zinc-900 hover:bg-zinc-100 font-bold px-8 h-12 rounded-xl">View Journals</Button>
                        <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 font-bold px-8 h-12 rounded-xl flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Submit Case Study
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4 border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" /> Latest Publications
                        </h2>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input placeholder="Search research paper..." className="pl-10 h-10 bg-white shadow-sm" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-green-500 animate-spin" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <Card key={post.id} className="group hover:shadow-2xl transition-all duration-300 border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col">
                                        <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
                                        <CardHeader className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter">Research Paper</Badge>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <CardTitle className="text-xl font-bold leading-snug group-hover:text-green-600 transition-colors">{post.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">
                                                {post.content}
                                            </p>
                                            <div className="mt-6 flex flex-wrap gap-2">
                                                {(post.tags || []).map((tag: any) => (
                                                    <span key={tag} className="text-[10px] bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded text-zinc-400 font-bold">#{tag}</span>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <div className="p-6 border-t bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-green-600" />
                                                </div>
                                                <span className="text-xs font-bold">{post.author?.fullName || "Prof. Researcher"}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400"><Download className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400"><Share2 className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center space-y-4">
                                    <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                                        <FileText className="h-10 w-10 text-zinc-200" />
                                    </div>
                                    <p className="text-zinc-400 italic">No research posts found in the archives.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-950/20">
                        <CardHeader>
                            <CardTitle className="text-green-900 dark:text-green-100 text-sm font-black uppercase tracking-widest">Research Goal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-green-700 dark:text-green-300 font-medium leading-relaxed">
                                "To empower local high-yield farming through decentralized data sharing and academic excellence."
                            </p>
                            <div className="pt-4 border-t border-green-200 dark:border-green-900">
                                <p className="text-[10px] font-black uppercase text-green-600">Total Publications</p>
                                <h4 className="text-2xl font-black text-green-900 dark:text-green-100">{posts.length}</h4>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest pl-2">Top Categories</h3>
                        <div className="space-y-2">
                            {["Soil Health", "Seed Mutation", "AI in Irrigation", "Livestock Breeding", "Weather Patterns"].map(cat => (
                                <div key={cat} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group cursor-pointer hover:border-green-500 transition-colors">
                                    <span className="text-xs font-bold group-hover:text-green-600 transition-colors">{cat}</span>
                                    <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-green-600 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
