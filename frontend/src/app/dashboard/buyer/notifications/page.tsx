"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    CheckCircle2,
    Clock,
    Info,
    AlertCircle,
    Trash2,
    Loader2,
    MailOpen,
    ArrowRight
} from "lucide-react";

export default function BuyerNotificationsPage() {
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
            if (response.ok) {
                setNotifications(await response.json());
            }
        } catch (error) {
            console.error("Notifications fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://localhost:3001/notifications/${id}/read`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            }
        } catch (error) {
            console.error("Mark as read error:", error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://localhost:3001/notifications/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(notifications.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error("Delete notification error:", error);
        }
    };

    const getIcon = (title: string) => {
        if (title.toLowerCase().includes("order")) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        if (title.toLowerCase().includes("alert")) return <AlertCircle className="h-5 w-5 text-red-500" />;
        return <Info className="h-5 w-5 text-blue-500" />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Accessing alert stream...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter flex items-center gap-3">
                        <Bell className="h-8 w-8 text-green-600" /> Notifications
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Stay updated on your orders and farm activities.</p>
                </div>
                <Button variant="outline" className="text-xs font-black uppercase tracking-widest border-zinc-200">
                    Mark All As Read
                </Button>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((msg) => (
                        <Card key={msg.id} className={`border-0 shadow-xl transition-all ${msg.read ? 'opacity-60 grayscale-[0.5]' : 'border-l-4 border-l-green-600 ring-1 ring-green-100'}`}>
                            <CardContent className="p-6">
                                <div className="flex gap-6 items-start">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                                        {getIcon(msg.title)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-black text-zinc-900 uppercase tracking-tight text-sm">{msg.title}</h3>
                                            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 uppercase">
                                                <Clock className="h-3 w-3" /> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-600 font-medium leading-relaxed">{msg.message}</p>
                                        <div className="flex gap-4 pt-3">
                                            {!msg.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-[10px] font-black uppercase tracking-widest text-green-600 p-0 hover:bg-transparent"
                                                    onClick={() => markAsRead(msg.id)}
                                                >
                                                    <MailOpen className="h-3 w-3 mr-1" /> Mark as read
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-[10px] font-black uppercase tracking-widest text-red-500 p-0 hover:bg-transparent"
                                                onClick={() => deleteNotification(msg.id)}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-zinc-50 rounded-3xl border-2 border-dashed">
                        <div className="h-20 w-20 rounded-full bg-zinc-200 flex items-center justify-center">
                            <Bell className="h-10 w-10 text-zinc-400" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Quiet as a night farm</h2>
                            <p className="text-zinc-500 font-medium">You have no new alerts at the moment.</p>
                        </div>
                    </div>
                )}
            </div>

            <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white border-0 shadow-2xl">
                <CardContent className="p-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Need Real-time Alerts?</h3>
                        <p className="text-zinc-400 text-sm font-medium">Enable browser push notifications to never miss a delivery.</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 font-black uppercase tracking-widest h-12 px-8 shadow-xl group">
                        ENABLE NOW <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
