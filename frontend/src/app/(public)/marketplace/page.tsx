"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Star, MapPin, Filter } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/api";

/**
 * Marketplace Page Component
 * Displays all available agricultural products
 * Features search, filtering, and add-to-cart functionality
 */
export default function MarketplacePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    /**
     * Fetch products from backend API
     */
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

    /**
     * Filter products based on search query
     */
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = async (productId: string) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                window.location.href = "/auth/login";
                return;
            }

            const response = await fetch(`${API_URL}/users/buyer/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });

            if (response.ok) {
                // Success feedback
                alert("Added to cart!");
            }
        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500 uppercase tracking-tighter">
                        Agricultural Marketplace
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                        Browse fresh produce directly from verified farmers across the region
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 bg-white dark:bg-zinc-900"
                        />
                    </div>

                    {/* Filter Button */}
                    <Button variant="outline" className="h-12 px-6">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-t-lg" />
                                <CardContent className="p-4 space-y-3">
                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-4">
                            <ShoppingCart className="h-12 w-12 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
                            No products found
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            {searchQuery ? "Try adjusting your search" : "Products will appear here soon"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-zinc-200 dark:border-zinc-800 overflow-hidden"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-6xl">
                                            🌾
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border-0">
                                        {product.category}
                                    </Badge>
                                </div>

                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                        {product.name}
                                    </CardTitle>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {product.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="pb-3 space-y-2">
                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            ${product.price}
                                        </span>
                                        <span className="text-sm text-zinc-500">/unit</span>
                                    </div>

                                    {/* Bulk Price (if available) */}
                                    {product.bulkPrice && (
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Bulk: ${product.bulkPrice}/unit
                                        </p>
                                    )}

                                    {/* Stock */}
                                    <p className="text-sm text-zinc-500">
                                        {product.quantity > 0 ? (
                                            <span className="text-green-600 dark:text-green-400 font-medium">
                                                {product.quantity} in stock
                                            </span>
                                        ) : (
                                            <span className="text-red-600 dark:text-red-400 font-medium">
                                                Out of stock
                                            </span>
                                        )}
                                    </p>
                                </CardContent>

                                <CardFooter className="pt-0">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest h-12"
                                        disabled={product.quantity === 0}
                                        onClick={() => addToCart(product.id)}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
