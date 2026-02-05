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
    ShoppingBag,
    Truck,
    Clock,
    CheckCircle2,
    Filter,
    ArrowRight,
    Loader2
} from "lucide-react";
import { OrderDetailsModal } from "@/components/dashboard/OrderDetailsModal";
import { API_URL } from "@/lib/api";

export default function BuyerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/orders`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-900";
            case "SHIPPED": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-900";
            case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900";
            case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-900";
            case "APPROVED": return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-purple-200 dark:border-purple-900";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items?.some((i: any) => i.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">My Purchases</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Track your orders from farm to doorstep.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Orders", value: orders.filter(o => ["PENDING", "APPROVED", "SHIPPED"].includes(o.status)).length, icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
                    { label: "In Transit", value: orders.filter(o => o.status === 'SHIPPED').length, icon: Truck, color: "text-blue-600", bgColor: "bg-blue-50" },
                    { label: "Completed", value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-0 shadow-lg overflow-hidden group">
                        <CardContent className="pt-6 relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                                    <h3 className="text-3xl font-black mt-1 text-zinc-900">
                                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
                                    </h3>
                                </div>
                                <div className={`h-12 w-12 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-0 shadow-2xl overflow-hidden">
                <CardHeader className="bg-zinc-50/50 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg flex items-center gap-2 font-black uppercase tracking-tight">
                            <ShoppingBag className="h-5 w-5 text-green-600" /> Order History
                        </CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    placeholder="Search order ID or product..."
                                    className="pl-10 h-10 w-64 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Order Vault...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-100/50 hover:bg-zinc-100/50">
                                        <TableHead className="font-black text-zinc-500 uppercase text-[10px] tracking-widest pl-6">Order ID</TableHead>
                                        <TableHead className="font-black text-zinc-500 uppercase text-[10px] tracking-widest">Items</TableHead>
                                        <TableHead className="font-black text-zinc-500 uppercase text-[10px] tracking-widest">Total Value</TableHead>
                                        <TableHead className="font-black text-zinc-500 uppercase text-[10px] tracking-widest">Date</TableHead>
                                        <TableHead className="font-black text-zinc-500 uppercase text-[10px] tracking-widest">Status</TableHead>
                                        <TableHead className="text-right font-black text-zinc-500 uppercase text-[10px] tracking-widest pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-zinc-50/50 transition-colors border-b last:border-0">
                                                <TableCell className="font-mono text-[10px] font-black text-zinc-400 pl-6">#{order.id.slice(0, 8).toUpperCase()}</TableCell>
                                                <TableCell>
                                                    <div className="flex -space-x-2 overflow-hidden py-2">
                                                        {order.items?.map((item: any, idx: number) => (
                                                            <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-zinc-100 overflow-hidden border">
                                                                {item.product.images?.[0] ? (
                                                                    <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-zinc-400">?</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {order.items?.length > 3 && (
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-white text-[10px] font-bold text-white">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-zinc-900">${parseFloat(order.total).toFixed(2)}</span>
                                                        <span className="text-[10px] font-bold text-zinc-400">{order.items?.length || 0} Products</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-bold text-zinc-600">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${getStatusStyle(order.status)} border px-2 py-0.5 rounded-lg font-black text-[9px] uppercase tracking-tighter`}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-[10px] font-black uppercase tracking-widest group text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        TICKET <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-20 text-zinc-400 italic font-medium">
                                                No orders found in your vault.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userRole="BUYER"
            />
        </div>
    );
}
