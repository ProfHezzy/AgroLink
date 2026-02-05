"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DollarSign,
    TrendingUp,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    CreditCard
} from "lucide-react";

export default function FarmerEarningsPage() {
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Authorization": `Bearer ${token}` };

            const [statsRes, ordersRes] = await Promise.all([
                fetch("http://localhost:3001/products/member/stats", { headers }),
                fetch("http://localhost:3001/orders", { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (ordersRes.ok) setOrders(await ordersRes.json());
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
    const pendingPayout = orders.filter(o => o.status === 'SHIPPED' || o.status === 'PENDING').reduce((acc, curr) => acc + parseFloat(curr.total), 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Financial Overview</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Track your farm's revenue, pending payouts, and transaction history.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 shadow-lg">
                        <Wallet className="mr-2 h-4 w-4" /> Request Payout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0 shadow-xl">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase opacity-80">Total Revenue</p>
                                <h3 className="text-3xl font-black mt-1">${stats?.totalEarnings?.toLocaleString() || "0.00"}</h3>
                                <div className="flex items-center text-[10px] mt-2 bg-white/20 w-fit px-2 py-0.5 rounded-full">
                                    <ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs last month
                                </div>
                            </div>
                            <DollarSign className="h-10 w-10 opacity-20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-1">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pending Payout</p>
                                <h3 className="text-2xl font-black mt-1 text-orange-600">${pendingPayout.toLocaleString() || "0.00"}</h3>
                                <p className="text-[10px] text-zinc-400 mt-1">Awaiting order fulfillment</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-1">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg. Order Value</p>
                                <h3 className="text-2xl font-black mt-1 text-blue-600">${(stats?.totalEarnings / (stats?.totalOrders || 1)).toFixed(2)}</h3>
                                <p className="text-[10px] text-zinc-400 mt-1">Efficiency metric</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-1">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Settled Deals</p>
                                <h3 className="text-2xl font-black mt-1 text-green-600">{deliveredOrders.length}</h3>
                                <p className="text-[10px] text-zinc-400 mt-1">Completed cycles</p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>A detailed list of your latest income activities.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-zinc-500"><Calendar className="h-4 w-4 mr-2" /> This Month</Button>
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
                                    <TableHead className="font-bold">Transaction ID</TableHead>
                                    <TableHead className="font-bold">Customer</TableHead>
                                    <TableHead className="font-bold">Amount</TableHead>
                                    <TableHead className="font-bold">Date</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="text-right font-bold">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <TableRow key={order.id} className="group">
                                            <TableCell className="font-mono text-[10px] uppercase font-bold text-zinc-400">{order.id.slice(0, 12)}</TableCell>
                                            <TableCell className="font-medium">{order.buyer?.fullName || "AgroLink User"}</TableCell>
                                            <TableCell className="font-bold text-zinc-900 dark:text-zinc-100">${parseFloat(order.total).toFixed(2)}</TableCell>
                                            <TableCell className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={order.status === 'DELIVERED' ? "bg-green-50 text-green-600 border-green-200" : "bg-zinc-50 text-zinc-500"}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <CreditCard className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-zinc-500">No transactions recorded yet.</TableCell>
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
import { CheckCircle2, Clock } from "lucide-react";
