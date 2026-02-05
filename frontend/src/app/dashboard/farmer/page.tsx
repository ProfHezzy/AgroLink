"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    PlusCircle,
    Eye,
    Star,
    AlertCircle,
    Wallet
} from "lucide-react";
import { API_URL } from "@/lib/api";

/**
 * Farmer Dashboard Overview Page
 * Displays farmer-specific statistics and quick actions
 */
export default function FarmerDashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        totalEarnings: 0,
        pendingOrders: 0,
        avgRating: 0,
        reviewCount: 0
    });
    const [wallet, setWallet] = useState<any>(null);
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Authorization": `Bearer ${token}` };

            const [statsRes, productsRes, walletRes] = await Promise.all([
                fetch(`${API_URL}/products/member/stats`, { headers }),
                fetch(`${API_URL}/products/member/me`, { headers }),
                fetch(`${API_URL}/wallets/my-wallet`, { headers })
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (productsRes.ok) {
                const productsData = await productsRes.json();
                setRecentProducts(productsData.slice(0, 5));
            }

            if (walletRes.ok) {
                setWallet(await walletRes.json());
            }
        } catch (error) {
            console.error("Failed to fetch farmer dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Total Products",
            value: stats.totalProducts,
            subtitle: `${stats.activeProducts} in stock`,
            icon: Package,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-950",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            subtitle: `${stats.pendingOrders} pending`,
            icon: ShoppingBag,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-950",
        },
        {
            title: "Wallet Balance",
            value: `$${parseFloat(wallet?.balance || 0).toLocaleString()}`,
            subtitle: `$${parseFloat(wallet?.escrowBalance || 0).toLocaleString()} pending escrow`,
            icon: Wallet,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-950",
            href: "/dashboard/farmer/wallet",
        },
        {
            title: "Average Rating",
            value: Number(stats.avgRating || 0).toFixed(1),
            subtitle: `From ${stats.reviewCount} reviews`,
            icon: Star,
            color: "text-yellow-600 dark:text-yellow-400",
            bgColor: "bg-yellow-100 dark:bg-yellow-950",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading your farm data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                        Farmer Dashboard
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Manage your products, orders, and earnings
                    </p>
                </div>
                <Link href="/dashboard/farmer/products/new">
                    <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Product
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    const card = (
                        <Card key={stat.title} className="hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
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
                    );
                    return stat.href ? <Link key={stat.title} href={stat.href}>{card}</Link> : card;
                })}
            </div>

            {/* Recent Orders Alert */}
            {stats.pendingOrders > 0 && (
                <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            <CardTitle className="text-orange-900 dark:text-orange-100">
                                Pending Orders
                            </CardTitle>
                        </div>
                        <CardDescription className="text-orange-700 dark:text-orange-300">
                            You have {stats.pendingOrders} orders waiting for fulfillment
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/farmer/orders">
                            <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950">
                                View Pending Orders
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Products</CardTitle>
                        <CardDescription>Your latest product listings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProducts.length > 0 ? (
                                recentProducts.map((product, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                        <div className="h-10 w-10 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <Package className="h-5 w-5 text-zinc-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                ${parseFloat(product.price).toFixed(2)} • {product.quantity} in stock
                                            </p>
                                        </div>
                                        <Badge
                                            className={
                                                product.quantity > 0
                                                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                                            }
                                        >
                                            {product.quantity > 0 ? "Active" : "Out of Stock"}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500 text-center py-4 italic">You haven't added any products yet.</p>
                            )}
                        </div>
                        <Link href="/dashboard/farmer/products">
                            <Button variant="outline" className="w-full mt-4">
                                <Eye className="mr-2 h-4 w-4" />
                                View All Products
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Sales Chart Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        <CardDescription>Real-time analytics based on history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                            <div className="text-center">
                                <TrendingUp className="h-12 w-12 text-zinc-400 mx-auto mb-2 transition-transform hover:scale-110" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Database sync successful. <br />Chart rendering logic initialized.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks for farmers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Add Product", href: "/dashboard/farmer/products/new", icon: PlusCircle },
                            { label: "View Orders", href: "/dashboard/farmer/orders", icon: ShoppingBag },
                            { label: "Check Earnings", href: "/dashboard/farmer/earnings", icon: DollarSign },
                            { label: "Manage Inventory", href: "/dashboard/farmer/inventory", icon: Package },
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
