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
    MoreVertical,
    Trash2,
    CheckCircle,
    AlertTriangle,
    Package,
    Eye,
    TrendingUp,
    Tag
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { API_URL } from "@/lib/api";

/**
 * Marketplace Management Page
 * Handles product moderation, inventory monitoring, and category management.
 */
export default function MarketplaceManagementPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.owner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Marketplace Management</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Moderating listings, categories, and inventory health.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Tag className="mr-2 h-4 w-4" />
                        Categories
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Promotion Rules
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-green-50 dark:bg-green-950/10 border-green-100 dark:border-green-900">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Active Listings</p>
                                <h3 className="text-3xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">{products.length}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Top Category</p>
                                <h3 className="text-3xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">Vegetables</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-950/10 border-orange-100 dark:border-orange-900">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">Low Stock Alerts</p>
                                <h3 className="text-3xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">12</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search by product name, category or farmer..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Sort
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="text-xl">
                                                                {product.category === "Grains" ? "🌾" : product.category === "Vegetables" ? "🥦" : "🥬"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{product.name}</div>
                                                        <div className="text-xs text-zinc-500">{product.category}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium">{product.owner?.fullName || "N/A"}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-green-600 dark:text-green-400">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </div>
                                                {product.bulkPrice && (
                                                    <div className="text-[10px] text-zinc-400">
                                                        Bulk: ${parseFloat(product.bulkPrice).toFixed(2)}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{product.quantity} units</div>
                                                {product.quantity < 10 && <Badge variant="outline" className="text-[10px] text-orange-500 border-orange-500 py-0">Low Stock</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Active</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Feature Listing
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Remove Product
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-zinc-500">
                                            No products found.
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
