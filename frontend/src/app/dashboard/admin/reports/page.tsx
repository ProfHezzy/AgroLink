"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    LineChart,
    PieChart,
    TrendingUp,
    Download,
    Calendar,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Target
} from "lucide-react";

export default function ReportsAnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Authorization": `Bearer ${token}` };

            const [userStats, orderStats, productsRes] = await Promise.all([
                fetch("http://localhost:3001/users/stats", { headers }),
                fetch("http://localhost:3001/orders/stats", { headers }),
                fetch("http://localhost:3001/products")
            ]);

            const uData = await userStats.json();
            const oData = await orderStats.json();
            const pData = await productsRes.json();

            setStats({
                users: uData,
                orders: oData,
                totalProducts: pData.length
            });
        } catch (error) {
            console.error("Failed to fetch analytical data:", error);
        } finally {
            setLoading(false);
        }
    };

    const kpis = [
        { label: "Total Users", value: stats?.users?.totalUsers || "0", trend: `+${stats?.users?.newUsers || 0} recent`, up: true },
        { label: "Gross Volume", value: `$${stats?.orders?.totalRevenue?.toLocaleString() || "0"}`, trend: "Lifetime", up: true },
        { label: "Active Items", value: stats?.totalProducts || "0", trend: "Marketplace", up: true },
        { label: "Conversion", value: "3.2%", trend: "Stable", up: true },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Reports & Analytics</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Deep diving into platform performance, user behavior, and market health.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 h-4 w-4" />
                        Full Export
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <Card key={idx}>
                        <CardContent className="pt-6">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{kpi.label}</p>
                            <div className="flex items-end justify-between mt-2">
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{kpi.value}</h3>
                                <div className={`flex items-center text-xs font-bold ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                                    {kpi.trend}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="min-h-[400px]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Growth Projections</CardTitle>
                                <CardDescription>Visualizing user and revenue scaling.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon"><Filter className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full pb-16">
                        <div className="text-center space-y-4">
                            <div className="mx-auto h-32 w-32 rounded-full border-8 border-green-500 border-t-transparent animate-spin-slow duration-1000" />
                            <p className="text-sm font-bold text-zinc-400 flex items-center justify-center">
                                <LineChart className="h-4 w-4 mr-2" />
                                Monitoring database streams...
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-h-[400px]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Order Distribution</CardTitle>
                                <CardDescription>Breakdown by current order status.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon"><Target className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full pb-16">
                        <div className="w-full max-w-xs space-y-4">
                            {Object.entries(stats?.orders?.ordersByStatus || {}).map(([status, count]: [any, any]) => (
                                <div key={status} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold uppercase">
                                        <span>{status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full">
                                        <div
                                            className="bg-green-500 h-full rounded-full transition-all"
                                            style={{ width: `${(count / stats.orders.totalOrders) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {(!stats?.orders?.totalOrders) && <p className="text-sm text-zinc-400 text-center">No order data yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
