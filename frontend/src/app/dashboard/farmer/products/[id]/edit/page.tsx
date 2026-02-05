"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Tag,
    DollarSign,
    Package,
    Image as ImageIcon,
    Save,
    ArrowLeft,
    CheckCircle2,
    Info,
    Spade,
    X,
    AlertCircle,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

/**
 * Edit Product Page
 * Allows farmers to update existing product listings.
 */
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/products/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({
                    name: data.name,
                    category: data.category,
                    price: data.price.toString(),
                    quantity: data.quantity.toString(),
                    description: data.description,
                });
                if (data.images && data.images.length > 0) {
                    setImagePreview(data.images[0]);
                }
            } else {
                setErrorMsg("Could not load product details.");
            }
        } catch (error) {
            console.error("Fetch product error:", error);
            setErrorMsg("Network error while loading product.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg(null);
        try {
            const token = localStorage.getItem("access_token");

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                category: formData.category,
                images: imagePreview ? [imagePreview] : []
            };

            const response = await fetch(`${API_URL}/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                router.push("/dashboard/farmer/products");
            } else {
                let errorData;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    errorData = await response.json();
                } else {
                    errorData = { message: await response.text() };
                }

                console.error("Update failed details:", errorData);
                setErrorMsg(errorData.message || (typeof errorData === 'string' ? errorData : JSON.stringify(errorData)));
            }
        } catch (error: any) {
            setErrorMsg(error.message || "An unexpected error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                <p className="text-zinc-500 font-medium tracking-tight">Syncing product data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/farmer/products">
                    <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border bg-white shadow-sm hover:bg-zinc-50">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Edit Product</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Keep your listing details up to date for better conversion.</p>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{errorMsg}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-2xl">
                        <CardHeader className="border-b bg-zinc-50/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="h-5 w-5 text-green-600" /> Listing Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Product Name</Label>
                                <Input
                                    className="h-14 text-lg font-bold border-zinc-200 focus-visible:ring-green-500"
                                    placeholder="e.g. Organic Red Tomatoes"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Category</Label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                        <Input
                                            className="h-12 pl-12"
                                            placeholder="Grains, Vegetables, etc."
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Price (per unit)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="h-12 pl-12 font-bold"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Stock Quantity</Label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                    <Input
                                        type="number"
                                        className="h-12 pl-12 font-bold"
                                        placeholder="Available units"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Detailed Description</Label>
                                <textarea
                                    className="w-full min-h-[180px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent p-5 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:outline-none leading-relaxed transition-all"
                                    placeholder="Describe your farming methods, quality benchmarks, and delivery options..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card
                        className="border-dashed border-2 bg-zinc-50 dark:bg-zinc-900/40 p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-green-500 transition-colors cursor-pointer group relative overflow-hidden"
                        onClick={handleImageClick}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {imagePreview ? (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" size="sm" onClick={removeImage}>
                                        <X className="h-4 w-4 mr-2" /> Remove
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="h-20 w-20 rounded-3xl bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ImageIcon className="h-10 w-10 text-zinc-300 group-hover:text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">Product Media</p>
                                    <p className="text-xs text-zinc-500 max-w-[150px] mx-auto">Update your product visuals.</p>
                                </div>
                                <Button variant="outline" type="button" className="border-green-600 text-green-600">Swap Photo</Button>
                            </>
                        )}
                    </Card>

                    <Card className="bg-zinc-900 text-white border-0 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Quality Assurance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "Accurate stock levels",
                                "Professional photos only",
                                "Fair marker pricing",
                                "Transparent descriptions"
                            ].map(rule => (
                                <div key={rule} className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> {rule}
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-6 border-t border-zinc-800">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-black uppercase shadow-xl group"
                            >
                                {saving ? "Saving Changes..." : <>Save Updates <Save className="ml-2 h-5 w-5 group-hover:scale-125 transition-transform" /></>}
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <Spade className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-blue-900 uppercase">Pro Tip</p>
                                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">Keeping price competitive with current market trends increases buyer confidence by 25%.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
