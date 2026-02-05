"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Lock,
    ShieldAlert,
    Activity,
    History,
    Key,
    UserX,
    RefreshCw,
    Search,
    Filter,
    Eye,
    Terminal
} from "lucide-react";

/**
 * Security & Logs Page
 * Monitoring system integrity, audit trails, and access management.
 */
export default function SecurityLogsPage() {
    const auditLogs = [
        { id: 1, action: "User Deleted", admin: "SuperAdmin", target: "MaliciousUser99", date: "2026-02-04 10:24", ip: "192.168.1.1", severity: "High" },
        { id: 2, action: "Settings Updated", admin: "SuperAdmin", target: "Commission Fees", date: "2026-02-04 09:15", ip: "192.168.1.1", severity: "Medium" },
        { id: 3, action: "Login Failed", admin: "N/A", target: "admin", date: "2026-02-03 23:45", ip: "45.12.56.23", severity: "Critical" },
        { id: 4, action: "Backup Created", admin: "System", target: "Full Snap 03", date: "2026-02-03 04:00", ip: "localhost", severity: "Low" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Security & Logs</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Deep visibility into system actions, access attempts, and administrative overhead.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Rotate Keys
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                        <UserX className="mr-2 h-4 w-4" />
                        Emergency Lockdown
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center">
                                    <History className="h-5 w-5 mr-2 text-zinc-400" /> Audit Trail
                                </CardTitle>
                                <CardDescription>Tracing every administrative action in chronological order.</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon"><Search className="h-4 w-4 text-zinc-400" /></Button>
                                <Button variant="ghost" size="icon"><Filter className="h-4 w-4 text-zinc-400" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                                            <th className="p-3 font-bold uppercase text-[10px] tracking-widest text-zinc-400">Action</th>
                                            <th className="p-3 font-bold uppercase text-[10px] tracking-widest text-zinc-400">Origin</th>
                                            <th className="p-3 font-bold uppercase text-[10px] tracking-widest text-zinc-400">Target</th>
                                            <th className="p-3 font-bold uppercase text-[10px] tracking-widest text-zinc-400">Date/IP</th>
                                            <th className="p-3 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {auditLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                                                <td className="p-3">
                                                    <div className="flex items-center">
                                                        <div className={`h-2 w-2 rounded-full mr-2 ${log.severity === "Critical" ? "bg-red-600 animate-pulse" :
                                                                log.severity === "High" ? "bg-red-400" :
                                                                    log.severity === "Medium" ? "bg-orange-400" : "bg-green-400"
                                                            }`} />
                                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{log.action}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-zinc-500 font-medium">{log.admin}</td>
                                                <td className="p-3 font-mono text-xs">{log.target}</td>
                                                <td className="p-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-zinc-900 dark:text-zinc-100 font-bold text-[10px]">{log.date}</span>
                                                        <span className="text-[10px] text-zinc-400 font-mono italic">{log.ip}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3 w-3" /></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950 border-zinc-800 font-mono">
                        <CardHeader className="border-b border-zinc-800">
                            <CardTitle className="text-green-500 flex items-center text-xs">
                                <Terminal className="h-3 w-3 mr-2" /> Live System Telemetry
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-1 text-xs text-green-700">
                            <p>[INFO] 12:04:11 - Received CORS request from frontend</p>
                            <p>[DB] 12:04:12 - Query executed (SELECT * FROM users WHERE active=true)</p>
                            <p className="text-orange-600">[WARN] 12:04:15 - High memory usage on Node Instance A</p>
                            <p>[AUTH] 12:04:17 - JWT successfully verified for user admin@agrolink.com</p>
                            <p>[INFO] 12:04:20 - WebSocket heartbeat acknowledged</p>
                            <div className="h-3 w-1.5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center">
                                <ShieldAlert className="h-4 w-4 mr-2 text-red-500" /> Active Threats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-red-600 uppercase">Brute Force Attempt</h4>
                                    <Badge className="bg-red-600 text-[9px]">CRITICAL</Badge>
                                </div>
                                <p className="text-[10px] text-red-900 dark:text-red-200">IP **45.12.56.23** blocked after 5 failed attempts.</p>
                                <Button className="w-full bg-red-600 hover:bg-red-700 h-7 text-[10px] font-bold uppercase mt-2">Whitelist Origin</Button>
                            </div>
                            <div className="flex items-center justify-between p-2 text-xs font-medium">
                                <span>DDoS Protection</span>
                                <span className="text-green-600 font-black">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between p-2 text-xs font-medium">
                                <span>SQL Injection Filter</span>
                                <span className="text-green-600 font-black">ACTIVE</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center">
                                <Key className="h-4 w-4 mr-2 text-blue-500" /> Administrative Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold">SuperAdmin</span>
                                    <Badge variant="outline" className="text-[9px] border-blue-500 text-blue-500">MFA ENABLED</Badge>
                                </div>
                                <p className="text-[10px] text-zinc-400">Last login: 5 mins ago</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold">Mod_Sarah</span>
                                    <Badge variant="outline" className="text-[9px] border-zinc-200">MFA DISABLED</Badge>
                                </div>
                                <p className="text-[10px] text-zinc-400">Last login: 4 hours ago</p>
                            </div>
                            <Button variant="outline" className="w-full h-8 text-[10px] font-black uppercase mt-2 border-zinc-200">Manage Access Keys</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
