"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    Loader2,
    CheckCircle2,
    MapPin,
    CreditCard,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function BuyerCartPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/users/buyer/cart`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setCartItems(await response.json());
            }
        } catch (error) {
            console.error("Cart fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (id: string, productId: string, newQty: number) => {
        if (newQty < 1) return;
        try {
            const token = localStorage.getItem("access_token");
            // For simplicity, we use addToCart with a negative/positive diff or just set it
            // Actually, my current addToCart increments. Let's make an update endpoint or just use add with 1/-1
            const response = await fetch(`${API_URL}/users/buyer/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: newQty - cartItems.find(i => i.id === id).quantity })
            });

            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error("Update quantity error:", error);
        }
    };

    const removeItem = async (id: string) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/users/buyer/cart/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error("Remove item error:", error);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 15.00 : 0;
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            // In a real app, this would call /orders to create an order from cart
            // For now, let's just simulate it
            const response = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: parseFloat(item.product.price)
                    })),
                    total: total
                })
            });

            if (response.ok) {
                // Cart is cleared automatically by the backend transaction
                router.push("/dashboard/buyer/orders");
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Syncing your basket...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter flex items-center gap-3">
                        <ShoppingCart className="h-10 w-10 text-green-600" /> My Basket
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Review your fresh selections before checkout.</p>
                </div>
                <Link href="/marketplace">
                    <Button variant="ghost" className="font-bold text-green-600 hover:bg-green-50">
                        Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id} className="border-0 shadow-xl overflow-hidden group hover:ring-2 hover:ring-green-500 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex gap-6">
                                        <div className="h-24 w-24 rounded-2xl bg-zinc-100 overflow-hidden border flex-shrink-0">
                                            {item.product.images?.[0] ? (
                                                <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <ShoppingBag className="h-8 w-8 text-zinc-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">{item.product.name}</h3>
                                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {item.product.owner?.fullName}, {item.product.owner?.location}
                                                    </p>
                                                </div>
                                                <p className="text-xl font-black text-green-600">${parseFloat(item.product.price).toFixed(2)}</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center bg-zinc-100 rounded-xl p-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg hover:bg-white"
                                                        onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg hover:bg-white"
                                                        onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <Card className="border-0 shadow-2xl bg-zinc-900 text-white overflow-hidden">
                            <CardHeader className="border-b border-zinc-800">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-400">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-zinc-500">Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-zinc-800 my-4" />
                                <div className="flex justify-between text-xl font-black">
                                    <span>Total Value</span>
                                    <span className="text-green-500">${total.toFixed(2)}</span>
                                </div>
                                <Button
                                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-black uppercase tracking-tight mt-6 group shadow-xl"
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                >
                                    {checkoutLoading ? "Processing..." : <>Confirm Order <CheckCircle2 className="ml-2 h-6 w-6 group-hover:scale-125 transition-transform" /></>}
                                </Button>
                                <p className="text-[10px] text-zinc-500 text-center uppercase font-black tracking-widest pt-4">Secure multi-layer encrypted payment</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: ShieldCheck, label: "Eco-Safe" },
                                { icon: CreditCard, label: "Insured" },
                                { icon: MapPin, label: "Live Track" }
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-2xl border space-y-1">
                                    <b.icon className="h-5 w-5 text-green-600" />
                                    <span className="text-[9px] font-black uppercase text-zinc-400">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-zinc-50 rounded-3xl border-2 border-dashed">
                    <div className="h-20 w-20 rounded-full bg-zinc-200 flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-zinc-400" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-zinc-900 uppercase">Your basket is empty</h2>
                        <p className="text-zinc-500 font-medium">Looks like you haven't added any farm treasures yet.</p>
                    </div>
                    <Link href="/marketplace">
                        <Button className="bg-green-600 hover:bg-green-700 font-black uppercase tracking-widest">
                            Shop Collections
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
