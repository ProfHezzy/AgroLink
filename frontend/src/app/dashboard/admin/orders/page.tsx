"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Search,
    Filter,
    Download,
    CreditCard,
    ShoppingBag,
    Truck,
    Clock,
    ArrowUpRight,
    ArrowDownLeft
} from "lucide-react";

/**
 * Orders & Transactions Page
 * Overview of all platform commerce activity.
 */
export default function OrdersTransactionsPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Authorization": `Bearer ${token}` };

            const [ordersRes, statsRes] = await Promise.all([
                fetch("http://localhost:3001/orders", { headers }),
                fetch("http://localhost:3001/orders/stats", { headers })
            ]);

            if (ordersRes.ok) setOrders(await ordersRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error("Failed to fetch orders data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
            case "SHIPPED": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
            case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
            case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Orders & Transactions</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Monitoring all financial exchange and shipment tracking across the platform.</p>
                </div>
                <Button variant="outline" className="border-green-600 text-green-600">
                    <Download className="mr-2 h-4 w-4" />
                    Export Reports
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase">Gross Volume</p>
                                <h3 className="text-2xl font-bold mt-1">${stats?.totalRevenue?.toLocaleString() || "0.00"}</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <ArrowUpRight className="h-3 w-3 mr-1" /> Live from DB
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase">Total Orders</p>
                                <h3 className="text-2xl font-bold mt-1">{stats?.totalOrders || 0}</h3>
                                <p className="text-xs text-blue-600 mt-1 flex items-center">
                                    <ShoppingBag className="h-3 w-3 mr-1" /> Lifetime
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase">Pending</p>
                                <h3 className="text-2xl font-bold mt-1">{stats?.ordersByStatus?.PENDING || 0}</h3>
                                <p className="text-xs text-orange-600 mt-1 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> Awaiting Action
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase">Delivered</p>
                                <h3 className="text-2xl font-bold mt-1">{stats?.ordersByStatus?.DELIVERED || 0}</h3>
                                <p className="text-xs text-green-600 mt-1">Successful completions</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Recent Orders</CardTitle>
                        <div className="flex space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    placeholder="Order ID or customer..."
                                    className="pl-10 h-9 w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <TableHead className="font-bold">Order ID</TableHead>
                                    <TableHead className="font-bold">Buyer</TableHead>
                                    <TableHead className="font-bold">Total</TableHead>
                                    <TableHead className="font-bold">Date</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs font-bold">{order.id.slice(0, 8)}...</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{order.buyer?.fullName || "Guest"}</span>
                                                    <span className="text-[10px] text-zinc-400 tracking-tight uppercase">
                                                        {order.buyer?.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold">${parseFloat(order.total).toFixed(2)}</TableCell>
                                            <TableCell className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusBadge(order.status)} border-0 font-bold px-2 py-0.5 text-[10px] rounded-full`}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8">Details</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-zinc-500">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
