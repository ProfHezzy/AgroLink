"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Heart,
    MapPin,
    Package,
    Store,
    ArrowRight,
    Loader2,
    Star,
    MessageCircle
} from "lucide-react";
import Link from "next/link";

export default function BuyerFavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:3001/users/buyer/favorites", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setFavorites(await response.json());
            }
        } catch (error) {
            console.error("Favorites fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const unfavorite = async (farmerId: string) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://localhost:3001/users/buyer/favorites/${farmerId}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                fetchFavorites();
            }
        } catch (error) {
            console.error("Unfavorite error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading your favorite farms...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Favorite Sellers</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">Farmers you trust and products you love.</p>
            </div>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites.map((fav) => (
                        <Card key={fav.id} className="border-0 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="h-32 bg-gradient-to-r from-green-600 to-green-400 relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm"
                                    onClick={() => unfavorite(fav.farmerId)}
                                >
                                    <Heart className="h-5 w-5 fill-current" />
                                </Button>
                            </div>
                            <CardContent className="pt-0 relative px-6 pb-8">
                                <div className="flex justify-center -mt-10 mb-4">
                                    <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-2xl">
                                        <div className="h-full w-full rounded-[20px] bg-zinc-100 overflow-hidden flex items-center justify-center border-2 border-white">
                                            {fav.farmer.avatar ? (
                                                <img src={fav.farmer.avatar} alt={fav.farmer.fullName} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-black text-green-600 uppercase">{fav.farmer.fullName?.charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center space-y-1">
                                    <h3 className="text-xl font-black text-zinc-900">{fav.farmer.fullName}</h3>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                        <MapPin className="h-3 w-3" /> {fav.farmer.location || "Earth"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 my-6">
                                    <div className="bg-zinc-50 rounded-2xl p-3 flex flex-col items-center justify-center">
                                        <Package className="h-4 w-4 text-green-600 mb-1" />
                                        <span className="text-sm font-black text-zinc-900">{fav.farmer._count?.products || 0}</span>
                                        <span className="text-[9px] font-black uppercase text-zinc-400">Products</span>
                                    </div>
                                    <div className="bg-zinc-50 rounded-2xl p-3 flex flex-col items-center justify-center">
                                        <Star className="h-4 w-4 text-amber-500 mb-1" />
                                        <span className="text-sm font-black text-zinc-900">4.9</span>
                                        <span className="text-[9px] font-black uppercase text-zinc-400">Rating</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 font-black uppercase text-[10px] tracking-widest h-10">
                                        <Store className="h-4 w-4 mr-2" /> VISIT FARM
                                    </Button>
                                    <Button variant="outline" className="h-10 w-10 p-0 border-zinc-200">
                                        <MessageCircle className="h-4 w-4 text-zinc-500" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-zinc-50 rounded-3xl border-2 border-dashed">
                    <div className="h-20 w-20 rounded-full bg-zinc-200 flex items-center justify-center">
                        <Heart className="h-10 w-10 text-zinc-400" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">No favorites yet</h2>
                        <p className="text-zinc-500 font-medium">Start exploring the marketplace to find your favorite farms.</p>
                    </div>
                    <Link href="/marketplace">
                        <Button className="bg-green-600 hover:bg-green-700 font-black uppercase tracking-widest">
                            Explore Marketplace
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
