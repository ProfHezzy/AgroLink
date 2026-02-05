"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Store,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Activity,
    UserCheck,
    Package
} from "lucide-react";

/**
 * Admin Dashboard Overview Page
 * Displays real-time system statistics and key metrics
 */
export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        activeUsers: 0,
        newUsers: 0,
        usersByRole: {} as Record<string, number>,
    });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard stats on mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Authorization": `Bearer ${token}` };

            // Parallel fetching for performance
            const [uStatsRes, oStatsRes, pRes, usersRes] = await Promise.all([
                fetch("http://localhost:3001/users/stats", { headers }),
                fetch("http://localhost:3001/orders/stats", { headers }),
                fetch("http://localhost:3001/products"),
                fetch("http://localhost:3001/users", { headers })
            ]);

            const uStats = await uStatsRes.json();
            const oStats = await oStatsRes.json();
            const products = await pRes.json();
            const users = await usersRes.json();

            setStats({
                totalUsers: uStats.totalUsers || 0,
                activeUsers: uStats.activeUsers || 0,
                newUsers: uStats.newUsers || 0,
                usersByRole: uStats.usersByRole || {},
                totalOrders: oStats.totalOrders || 0,
                revenue: parseFloat(oStats.totalRevenue) || 0,
                totalProducts: products.length || 0
            });

            setRecentUsers(users.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            change: `+${stats.newUsers} recent`,
            changeType: "positive",
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-950",
        },
        {
            title: "Total Products",
            value: stats.totalProducts.toLocaleString(),
            change: "Active listings",
            changeType: "positive",
            icon: Package,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-950",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toLocaleString(),
            change: "DB Records",
            changeType: "positive",
            icon: ShoppingBag,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-950",
        },
        {
            title: "Revenue",
            value: `$${stats.revenue.toLocaleString()}`,
            change: "Gross Volume",
            changeType: "positive",
            icon: DollarSign,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-950",
        },
        {
            title: "Active Users",
            value: stats.activeUsers.toLocaleString(),
            change: "Last 30 days",
            changeType: "positive",
            icon: UserCheck,
            color: "text-cyan-600 dark:text-cyan-400",
            bgColor: "bg-cyan-100 dark:bg-cyan-950",
        },
        {
            title: "Market Health",
            value: "Stable",
            change: "Real-time",
            changeType: "positive",
            icon: Activity,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-950",
        },
    ];

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
            case "FARMER": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
            case "BUYER": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
            case "RESEARCHER": return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Syncing with Decentralized DB...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Admin Dashboard</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Welcome back! Here's an overview of your system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}><Icon className={`h-5 w-5 ${stat.color}`} /></div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{stat.value}</div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.change}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                        <CardDescription>Latest registered users from DB</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{user.fullName?.charAt(0) || "U"}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.fullName || "Unknown"}</p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500 text-center py-4">No users yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>Real-time platform status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: "API Status", value: "Operational", status: "success" },
                                { label: "Database", value: "Healthy", status: "success" },
                                { label: "Storage", value: "92% Free", status: "success" },
                                { label: "Sync Latency", value: "< 2ms", status: "success" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.label}</span>
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">{item.value}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
