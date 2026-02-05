"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    LifeBuoy,
    Search,
    BookOpen,
    MessageCircle,
    Phone,
    FileText,
    ArrowRight,
    PlayCircle,
    ChevronRight,
    Mail
} from "lucide-react";

export default function FarmerHelpCenterPage() {
    return (
        <div className="space-y-10 pb-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-3">
                    <LifeBuoy className="h-10 w-10 text-green-600" /> Farmer Support
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Need help managing your crops or navigating the marketplace? We've got you covered.
                </p>
                <div className="relative mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                        placeholder="Search for guides, policies, or solutions..."
                        className="pl-12 h-14 text-lg rounded-2xl shadow-xl border-zinc-200 focus:ring-green-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Getting Started", icon: PlayCircle, desc: "New to AgroLink? Learn the ropes of digital farming.", color: "text-blue-500", items: ["Creating your first listing", "Setting up payments", "Verifying your farm"] },
                    { title: "Marketplace Rules", icon: FileText, desc: "Important policies regarding pricing and quality.", color: "text-red-500", items: ["Commission structure", "Prohibited items", "Return policy"] },
                    { title: "Technical Support", icon: Smartphone, desc: "Having issues with the app or notifications?", color: "text-purple-500", items: ["Resetting password", "App performance", "Offline mode"] },
                ].map((category, i) => (
                    <Card key={i} className="group hover:-translate-y-2 transition-all duration-300 border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl">
                        <CardHeader>
                            <category.icon className={`h-10 w-10 ${category.color} mb-2`} />
                            <CardTitle>{category.title}</CardTitle>
                            <CardDescription>{category.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {category.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-zinc-50 dark:border-zinc-900 group/item hover:bg-zinc-50/50 cursor-pointer rounded px-1">
                                    <span className="text-zinc-700 dark:text-zinc-300 font-medium group-hover/item:text-green-600 transition-colors">{item}</span>
                                    <ChevronRight className="h-4 w-4 text-zinc-300 group-hover/item:text-green-600" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-zinc-900 text-white overflow-hidden border-0 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 md:p-12 space-y-6">
                        <Badge className="bg-green-600 text-white border-0 px-3 py-1">24/7 Priority Support</Badge>
                        <h2 className="text-3xl font-bold leading-tight">Can't find what you're looking for?</h2>
                        <p className="text-zinc-400">Our dedicated team of agricultural experts is available round the clock to help with your farm operations.</p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button className="bg-white text-zinc-900 hover:bg-zinc-100 px-6 h-12 rounded-xl font-bold flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" /> Start Live Chat
                            </Button>
                            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 px-6 h-12 rounded-xl font-bold flex items-center gap-2">
                                <Mail className="h-5 w-5" /> Email Support
                            </Button>
                        </div>
                    </div>
                    <div className="bg-green-600/10 flex items-center justify-center p-12 relative overflow-hidden">
                        <Phone className="h-64 w-64 text-green-600 absolute -bottom-10 -right-10 opacity-20 rotate-12" />
                        <div className="relative z-10 text-center space-y-2">
                            <p className="text-green-500 font-black tracking-widest uppercase">Hotline</p>
                            <h3 className="text-5xl font-black">+234 (800) AGRO-HELP</h3>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex justify-between items-center text-xs text-zinc-500 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-4">
                    <span className="hover:text-green-600 cursor-pointer">Terms of Service</span>
                    <span className="hover:text-green-600 cursor-pointer">Privacy Policy</span>
                    <span className="hover:text-green-600 cursor-pointer">Security</span>
                </div>
                <span>AgroLink v2.4.0 (Stable)</span>
            </div>
        </div>
    );
}

import { Smartphone } from "lucide-react";
