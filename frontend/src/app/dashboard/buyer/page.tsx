"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingCart,
    ShoppingBag,
    DollarSign,
    Heart,
    Package,
    TrendingUp,
    Store,
    Clock,
    Wallet
} from "lucide-react";
import { API_URL } from "@/lib/api";

/**
 * Buyer Dashboard Overview Page
 */
export default function BuyerDashboardPage() {
    const [stats, setStats] = useState({
        cartItems: 0,
        totalOrders: 0,
        totalSpent: 0,
        favoriteSellers: 0,
        pendingOrders: 0,
    });
    const [wallet, setWallet] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [favoriteSellersList, setFavoriteSellersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Authorization": `Bearer ${token}` };

            // Fetch Stats
            const statsRes = await fetch(`${API_URL}/users/buyer/stats`, { headers });
            if (statsRes.ok) setStats(await statsRes.json());

            // Fetch Wallet
            const walletRes = await fetch(`${API_URL}/wallets/my-wallet`, { headers });
            if (walletRes.ok) setWallet(await walletRes.json());

            // Fetch Recent Orders
            const ordersRes = await fetch(`${API_URL}/orders?take=4`, { headers });
            if (ordersRes.ok) setRecentOrders(await ordersRes.json());

            // Fetch Favorites
            const favRes = await fetch(`${API_URL}/users/buyer/favorites`, { headers });
            if (favRes.ok) setFavoriteSellersList(await favRes.json());

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Cart Items",
            value: stats.cartItems,
            subtitle: "Ready to checkout",
            icon: ShoppingCart,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-950",
            href: "/dashboard/buyer/cart",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            subtitle: `${stats.pendingOrders} pending`,
            icon: ShoppingBag,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-950",
            href: "/dashboard/buyer/orders",
        },
        {
            title: "Wallet Balance",
            value: `$${parseFloat(wallet?.balance || 0).toLocaleString()}`,
            subtitle: `$${parseFloat(wallet?.escrowBalance || 0).toLocaleString()} in escrow`,
            icon: Wallet,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-950",
            href: "/dashboard/buyer/wallet",
        },
        {
            title: "Favorite Sellers",
            value: stats.favoriteSellers,
            subtitle: "Trusted farmers",
            icon: Heart,
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-950",
            href: "/dashboard/buyer/favorites",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                        Buyer Dashboard
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Manage your orders, cart, and favorite sellers
                    </p>
                </div>
                <Link href="/marketplace">
                    <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
                        <Store className="mr-2 h-4 w-4" />
                        Browse Marketplace
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.title} href={stat.href}>
                            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {stat.subtitle}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Your latest purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                Order #{order.id.slice(0, 8)}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {order.items?.length || 0} items • ${parseFloat(order.total).toFixed(2)} • {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge
                                            className={
                                                order.status === "DELIVERED"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                                    : order.status === "SHIPPED"
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-zinc-500 text-sm italic">
                                    No orders found.
                                </div>
                            )}
                        </div>
                        <Link href="/dashboard/buyer/orders">
                            <Button variant="outline" className="w-full mt-4">
                                View All Orders
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Favorite Sellers</CardTitle>
                        <CardDescription>Your trusted farmers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {favoriteSellersList.length > 0 ? (
                                favoriteSellersList.map((fav, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center overflow-hidden">
                                                {fav.farmer.avatar ? (
                                                    <img src={fav.farmer.avatar} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                        {fav.farmer.fullName?.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {fav.farmer.fullName}
                                                </p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {fav.farmer._count?.products || 0} products • {fav.farmer.location || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-zinc-500 text-sm italic">
                                    No favorite sellers yet.
                                </div>
                            )}
                        </div>
                        <Link href="/dashboard/buyer/favorites">
                            <Button variant="outline" className="w-full mt-4">
                                View All Favorites
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common buyer tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Browse Products", href: "/marketplace", icon: Store },
                            { label: "View Cart", href: "/dashboard/buyer/cart", icon: ShoppingCart },
                            { label: "Track Orders", href: "/dashboard/buyer/orders", icon: Package },
                            { label: "Bulk Orders", href: "/dashboard/buyer/bulk-orders", icon: TrendingUp },
                        ].map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.label} href={action.href}>
                                    <button className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 group w-full">
                                        <Icon className="h-8 w-8 text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-400 mb-2" />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-green-700 dark:group-hover:text-green-400 text-center">
                                            {action.label}
                                        </span>
                                    </button>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
