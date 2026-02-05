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
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Package,
    Tag,
    ChevronDown,
    Filter
} from "lucide-react";
import Link from "next/link";

export default function MyProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:3001/products/member/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://localhost:3001/products/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) fetchProducts();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">My Farm Products</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Inventory and pricing management for your high-quality produce.</p>
                </div>
                <Link href="/dashboard/farmer/products/new">
                    <Button className="bg-green-600 hover:bg-green-700 shadow-md">
                        <Plus className="mr-2 h-4 w-4" /> Add New Listing
                    </Button>
                </Link>
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search your catalog..."
                                className="pl-10 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-10">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-50 dark:bg-zinc-900 border-b">
                                        <TableHead className="font-bold">Product</TableHead>
                                        <TableHead className="font-bold">Category</TableHead>
                                        <TableHead className="font-bold">Price</TableHead>
                                        <TableHead className="font-bold">Quantity</TableHead>
                                        <TableHead className="text-right font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <TableRow key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                                            {product.images && product.images.length > 0 ? (
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="h-5 w-5 text-zinc-400" />
                                                            )}
                                                        </div>
                                                        {product.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-0">{product.category}</Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={product.quantity < 10 ? "text-red-500 font-bold" : ""}>
                                                        {product.quantity} units
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" title="View">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Link href={`/dashboard/farmer/products/${product.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600" title="Edit">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600"
                                                            title="Delete"
                                                            onClick={() => handleDelete(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                                                No products found in your catalog.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
