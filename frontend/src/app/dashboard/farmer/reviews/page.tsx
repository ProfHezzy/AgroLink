"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Star,
    MessageCircle,
    ThumbsUp,
    Calendar,
    User,
    ChevronDown,
    Search,
    Loader2,
    Quote,
    TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FarmerReviewsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await fetch("http://localhost:3001/products/member/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) setStats(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const mockReviews = [
        { id: 1, user: "Alice Johnson", rating: 5, comment: "The organic tomatoes were incredibly fresh and flavorful! Best harvest I've seen in months.", product: "Organic Tomatoes", date: "2 days ago" },
        { id: 2, user: "Bob Smith", rating: 4, comment: "Great quality corn, though shipping took an extra day. Overall very satisfied with the produce.", product: "Sweet Corn", date: "1 week ago" },
        { id: 3, user: "Charlie Davis", rating: 5, comment: "High quality bell peppers. Perfect for my restaurant inventory. Will definitely order again.", product: "Bell Peppers", date: "2 weeks ago" }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Reputation & Reviews</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">Analyze your customer feedback and maintain your high-quality farm standards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-zinc-900 text-white border-0 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center p-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent pointer-events-none" />
                    <Star className="h-16 w-16 text-yellow-500 fill-yellow-500 mb-4 animate-pulse" />
                    <h2 className="text-5xl font-black">{stats?.avgRating?.toFixed(1) || "0.0"}</h2>
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-400 mt-2">Global Satisfaction Score</p>
                    <div className="flex gap-1 mt-6">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-4 w-4 ${i <= Math.round(stats?.avgRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />)}
                    </div>
                </Card>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="border-zinc-100 dark:border-zinc-800 flex flex-col justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Testimonials</CardTitle>
                        </CardHeader>
                        <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-100">{stats?.reviewCount || 0}</h3>
                        <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> 100% Verified Buyers
                        </p>
                    </Card>

                    <Card className="border-zinc-100 dark:border-zinc-800 flex flex-col justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-400">Response Rate</CardTitle>
                        </CardHeader>
                        <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-100">92%</h3>
                        <p className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" /> Average response within 2h
                        </p>
                    </Card>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4 border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Quote className="h-4 w-4 text-green-600" /> Recent Customer Stories
                    </h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input placeholder="Filter by product..." className="h-9 w-48 text-xs pl-10" />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold border-zinc-200">
                            Newest <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 text-green-500 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {mockReviews.map((review) => (
                            <Card key={review.id} className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                <div className="h-16 w-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-green-600 font-black text-2xl flex-shrink-0">
                                    {review.user.charAt(0)}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{review.user}</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-50 text-green-700 border-green-100 text-[10px] font-black uppercase h-5">{review.product}</Badge>
                                                <div className="flex">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-200'}`} />)}</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {review.date}</span>
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium italic">"{review.comment}"</p>
                                </div>
                                <div className="flex gap-2 md:flex-col lg:flex-row">
                                    <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] font-black uppercase text-zinc-500 border-zinc-200 hover:bg-zinc-50">Reply</Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-black uppercase text-blue-500 hover:bg-blue-50">
                                        <ThumbsUp className="h-3 w-3 mr-2" /> Helpful
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
