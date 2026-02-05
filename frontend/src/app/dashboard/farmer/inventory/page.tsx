"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Package,
    AlertTriangle,
    RefreshCw,
    Plus,
    History,
    ArrowUpRight,
    Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FarmerInventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:3001/products/member/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) setProducts(await response.json());
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const lowStockThreshold = 20;
    const lowStockItems = products.filter(p => p.quantity < lowStockThreshold);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Inventory Tracking</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Real-time stock monitoring and replenishment tools.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchInventory} disabled={loading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" /> Batch Update
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase">Active SKU Count</p>
                                <h3 className="text-3xl font-black mt-1">{products.length}</h3>
                            </div>
                            <Package className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className={lowStockItems.length > 0 ? "border-l-4 border-l-red-500 bg-red-50/30" : "border-l-4 border-l-blue-500"}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase">Critical Warnings</p>
                                <h3 className="text-3xl font-black mt-1">{lowStockItems.length}</h3>
                            </div>
                            <AlertTriangle className={`h-8 w-8 ${lowStockItems.length > 0 ? 'text-red-500 animate-pulse' : 'text-blue-200'}`} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase">Market Velocity</p>
                                <h3 className="text-3xl font-black mt-1">High</h3>
                            </div>
                            <History className="h-8 w-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-zinc-400" /> Real-time Warehouse View
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-zinc-50 dark:bg-zinc-900 border-y">
                                    <TableHead className="w-[300px]">Product</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Health</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-12">Loading warehouse data...</TableCell></TableRow>
                                ) : products.length > 0 ? (
                                    products.map((p) => {
                                        const stockLevel = Math.min((p.quantity / 500) * 100, 100);
                                        return (
                                            <TableRow key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                                                <TableCell className="font-semibold">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                                                            {p.images && p.images.length > 0 ? (
                                                                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <Package className="h-4 w-4 text-zinc-400" />
                                                            )}
                                                        </div>
                                                        {p.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="w-[200px]">
                                                    <Progress value={stockLevel} className={`h-2 ${p.quantity < lowStockThreshold ? 'bg-red-200' : 'bg-zinc-200'}`} />
                                                </TableCell>
                                                <TableCell className="font-mono">{p.quantity} units</TableCell>
                                                <TableCell>
                                                    <Badge className={p.quantity < lowStockThreshold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                                                        {p.quantity < lowStockThreshold ? "Replenish" : "Optimal"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 group">
                                                        Refill <ArrowUpRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow><TableCell colSpan={5} className="text-center py-12">Empty Warehouse.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
