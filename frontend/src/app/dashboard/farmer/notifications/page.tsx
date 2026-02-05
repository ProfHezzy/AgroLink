"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Bell,
    CheckCheck,
    Trash2,
    Info,
    AlertCircle,
    Calendar,
    MessageCircle,
    ShoppingBag
} from "lucide-react";

export default function FarmerNotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:3001/notifications", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) setNotifications(await response.json());
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes("order") || t.includes("sale")) return <ShoppingBag className="h-5 w-5 text-blue-500" />;
        if (t.includes("message")) return <MessageCircle className="h-5 w-5 text-green-500" />;
        if (t.includes("urgent") || t.includes("alert")) return <AlertCircle className="h-5 w-5 text-red-500" />;
        return <Info className="h-5 w-5 text-zinc-400" />;
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                        <Bell className="h-8 w-8 text-green-600" /> Notifications
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Stay updated with your farm activity and market alerts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 px-4 font-bold border-zinc-200">
                        <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
                    </Button>
                </div>
            </div>

            <Card className="border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                <CardContent className="p-0 divide-y divide-zinc-50 dark:divide-zinc-900">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div key={n.id} className="p-5 flex items-start gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors group">
                                <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                    {getIcon(n.title)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{n.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-zinc-400 flex items-center uppercase font-black"><Calendar className="h-3 w-3 mr-1" /> {new Date(n.createdAt).toLocaleDateString()}</span>
                                            {!n.read && <div className="h-2 w-2 rounded-full bg-green-500" />}
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{n.message}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 space-y-4">
                            <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                                <Bell className="h-10 w-10 text-zinc-200" />
                            </div>
                            <p className="text-zinc-400 font-medium italic">Everything is quiet. No new alerts at the moment.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
