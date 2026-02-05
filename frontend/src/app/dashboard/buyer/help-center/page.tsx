"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    HelpCircle,
    Search,
    ShoppingBag,
    Truck,
    ShieldCheck,
    MessageCircle,
    FileText,
    ArrowRight,
    ExternalLink,
    ChevronRight
} from "lucide-react";

export default function BuyerHelpCenterPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="relative overflow-hidden rounded-[40px] bg-zinc-900 text-white p-12 lg:p-20 shadow-2xl">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-green-600/20 blur-[120px] rounded-full -mr-20 -mt-20" />
                <div className="relative z-10 space-y-8 max-w-2xl">
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">How can we <span className="text-green-500 underline decoration-8 underline-offset-8">assist</span> you today?</h1>
                        <p className="text-zinc-400 text-lg font-medium">Search our knowledge base or reach out to our farm-link specialists.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-500" />
                        <Input
                            placeholder="e.g. tracking my order, returns policy, bulk discounts..."
                            className="h-16 pl-16 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-zinc-500 font-bold text-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Ordering", icon: ShoppingBag, color: "text-blue-500", bgColor: "bg-blue-50" },
                    { label: "Delivery", icon: Truck, color: "text-amber-500", bgColor: "bg-amber-50" },
                    { label: "Payments", icon: ShieldCheck, color: "text-green-500", bgColor: "bg-green-50" },
                    { label: "Accounts", icon: HelpCircle, color: "text-purple-500", bgColor: "bg-purple-50" },
                ].map((cat, i) => (
                    <Card key={i} className="border-0 shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
                            <div className={`h-16 w-16 rounded-3xl ${cat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <cat.icon className={`h-8 w-8 ${cat.color}`} />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px] text-zinc-400">{cat.label}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <FileText className="h-6 w-6 text-green-600" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                "How do I ensure the products are organic?",
                                "What is the delivery timeline for fresh produce?",
                                "Can I cancel my order after it has been approved?",
                                "How do bulk purchase discounts work?",
                                "What happens if my produce arrived damaged?"
                            ].map((q, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-6 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all group border border-zinc-100">
                                    <span className="font-bold text-zinc-900 text-left">{q}</span>
                                    <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="border-0 shadow-2xl bg-green-50/50 border-green-100">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-green-600" /> Live Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm font-medium text-zinc-600">
                            <p>Our average response time for buyers is under 15 minutes during farm hours.</p>
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border">
                                    <span>Mon - Fri</span>
                                    <span className="font-black text-zinc-900 uppercase text-[10px]">08 AM - 06 PM</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border">
                                    <span>Sat - Sun</span>
                                    <span className="font-black text-zinc-900 uppercase text-[10px]">10 AM - 04 PM</span>
                                </div>
                            </div>
                            <Button className="w-full h-12 bg-green-600 hover:bg-green-700 font-black uppercase tracking-widest mt-4">
                                START CHAT
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-[32px] border-2 border-dashed border-zinc-200 space-y-4">
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Documentation</h3>
                        <div className="space-y-2">
                            {[
                                "Buyer Protection Policy",
                                "Shipping & Handling FAQ",
                                "Refunds and Claims"
                            ].map((doc, i) => (
                                <button key={i} className="w-full flex items-center justify-between text-xs font-bold text-zinc-900 hover:text-green-600 py-2 group">
                                    {doc} <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
