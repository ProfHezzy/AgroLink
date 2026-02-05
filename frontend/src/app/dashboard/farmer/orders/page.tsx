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
    ArrowRight
} from "lucide-react";
import { OrderDetailsModal } from "@/components/dashboard/OrderDetailsModal";
import { API_URL } from "@/lib/api";

export default function MyOrdersPage() {
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

    const updateStatus = async (id: string, action: 'approve' | 'ship') => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/orders/${id}/${action}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error(`${action} failed:`, error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
            case "SHIPPED": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
            case "APPROVED": return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
            case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
            case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.buyer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Fulfillment Center</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Track incoming orders and manage shipping status in real-time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "New Requests", value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: "text-yellow-600" },
                    { label: "Active Shipments", value: orders.filter(o => o.status === 'SHIPPED').length, icon: Truck, color: "text-blue-600" },
                    { label: "Completed", value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle2, color: "text-green-600" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">{stat.label}</p>
                                    <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                                </div>
                                <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-green-600" /> Recent Assignments
                        </CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    placeholder="Order ID or buyer name..."
                                    className="pl-10 h-10 w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline"><Filter className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 border-y">
                                        <TableHead className="font-bold">Order ID</TableHead>
                                        <TableHead className="font-bold">Buyer</TableHead>
                                        <TableHead className="font-bold">Total</TableHead>
                                        <TableHead className="font-bold">Date</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="text-right font-bold">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-zinc-50/10 transition-colors">
                                                <TableCell className="font-mono text-xs font-bold text-zinc-500">{order.id.slice(0, 8)}...</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{order.buyer?.fullName || "Guest Customer"}</span>
                                                        <span className="text-[10px] text-zinc-400">{order.buyer?.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-black text-zinc-900 dark:text-zinc-100">${parseFloat(order.total).toFixed(2)}</TableCell>
                                                <TableCell className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge className={`${getStatusBadge(order.status)} border-0 font-bold`}>{order.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {order.status === "PENDING" && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 bg-blue-600 hover:bg-blue-700 text-[10px] font-bold"
                                                                onClick={() => updateStatus(order.id, "approve")}
                                                            >
                                                                Approve
                                                            </Button>
                                                        )}
                                                        {order.status === "APPROVED" && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 bg-amber-600 hover:bg-amber-700 text-[10px] font-bold"
                                                                onClick={() => updateStatus(order.id, "ship")}
                                                            >
                                                                Ship Order
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-xs font-bold group"
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setIsModalOpen(true);
                                                            }}
                                                        >
                                                            Details <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-zinc-500 italic">
                                                No orders matched your search criteria.
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
                userRole="FARMER"
            />
        </div>
    );
}
