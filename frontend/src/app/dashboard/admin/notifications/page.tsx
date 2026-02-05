"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Bell,
    Send,
    Trash2,
    Mail,
    MessageSquare,
    AlertTriangle,
    Info,
    CheckCircle,
    Plus,
    Clock
} from "lucide-react";

/**
 * Admin Notifications Page
 * System-wide alert management and communication hub.
 */
export default function AdminNotificationsPage() {
    const recentNotifications = [
        { id: 1, type: "System", title: "Maintenance Scheduled", message: "Platform will be down for 2 hours on Sunday.", recipients: "All Users", sentAt: "2h ago", status: "Active" },
        { id: 2, type: "Alert", title: "Price Drop Detected", message: "Maize prices fell by 15% in Kano region.", recipients: "Farmers, Buyers", sentAt: "5h ago", status: "Sent" },
        { id: 3, type: "Info", title: "New Research Paper", message: "Soil quality report for Southwest now available.", recipients: "Researchers", sentAt: "1d ago", status: "Expired" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">System Notifications</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Broadcast messages, manage automated alerts, and monitor user communication.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Broadcast
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Broadcast History</CardTitle>
                            <CardDescription>Review and manage sent system-wide notifications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentNotifications.map((notif) => (
                                    <div key={notif.id} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <div className={`mt-1 h-9 w-9 rounded-lg flex items-center justify-center ${notif.type === "System" ? "bg-red-50 text-red-600" :
                                                        notif.type === "Alert" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                                                    }`}>
                                                    {notif.type === "System" ? <AlertTriangle className="h-5 w-5" /> :
                                                        notif.type === "Alert" ? <Info className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{notif.title}</h4>
                                                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{notif.message}</p>
                                                    <div className="flex items-center space-x-3 mt-2">
                                                        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">TO: {notif.recipients}</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">• {notif.sentAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <Badge variant="outline" className={`${notif.status === "Active" ? "border-green-500 text-green-500" :
                                                        notif.status === "Sent" ? "border-blue-500 text-blue-500" : "border-zinc-300 text-zinc-400"
                                                    } text-[10px] uppercase font-black px-2 py-0`}>
                                                    {notif.status}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Automated Rules</CardTitle>
                            <CardDescription>Define when the system should automatically notify users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: "Low Stock Alert", trigger: "Quantity < 10", target: "Farmers" },
                                    { title: "Price Volatility", trigger: "Price Change > 20%", target: "Buyers" },
                                    { title: "Order Unfulfilled", trigger: "Time > 48h", target: "Admins" },
                                    { title: "Research Flagged", trigger: "Flags > 3", target: "Moderators" },
                                ].map((rule, idx) => (
                                    <div key={idx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{rule.title}</p>
                                            <p className="text-[10px] text-zinc-400">Trigger: {rule.trigger}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Send className="h-3 w-3 text-zinc-400 text-green-600" /></Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-950 border-zinc-800 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Send className="h-24 w-24 rotate-12" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-green-400 flex items-center">
                                <Send className="h-4 w-4 mr-2" /> Quick Broadcast
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase text-zinc-500">Target Audience</p>
                                <div className="flex flex-wrap gap-2">
                                    {["All", "Farmers", "Buyers", "Researchers"].map(tag => (
                                        <Badge key={tag} className="bg-zinc-800 text-[10px] border-zinc-700 hover:bg-green-600 cursor-pointer">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-green-600 min-h-[100px]"
                                placeholder="Type your message here..."
                            />
                            <Button className="w-full bg-green-600 hover:bg-green-700 font-bold uppercase text-xs">
                                Send Notification Now
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Channel Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-[10px]">
                                <div className="flex items-center"><Mail className="h-3 w-3 mr-1 text-blue-500" /> Email (SMTP)</div>
                                <span className="text-green-600 font-bold">OPERATIONAL</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <div className="flex items-center"><MessageSquare className="h-3 w-3 mr-1 text-green-500" /> In-App Push</div>
                                <span className="text-green-600 font-bold">OPERATIONAL</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <div className="flex items-center"><Clock className="h-3 w-3 mr-1 text-orange-500" /> SMS Gateway</div>
                                <span className="text-orange-600 font-bold">DEGRADED</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
