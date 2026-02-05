"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Settings,
    Globe,
    Coins,
    Lock,
    Database,
    Smartphone,
    CheckCircle,
    Save,
    RotateCcw
} from "lucide-react";

/**
 * System Settings Page
 * Platform-wide configurations, commerce rules, and localization.
 */
export default function SystemSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">System Settings</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Configure core platform behavior, financial parameters, and global constraints.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Defaults
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Globe className="h-5 w-5 mr-2 text-blue-500" /> General Configuration
                            </CardTitle>
                            <CardDescription>Basic platform identities and localization settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="platform-name">Platform Name</Label>
                                    <Input id="platform-name" defaultValue="AgroLink" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="support-email">Support Contact</Label>
                                    <Input id="support-email" defaultValue="support@agrolink.co" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="base-currency">Base Currency</Label>
                                    <Input id="base-currency" defaultValue="USD ($)" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time-zone">Default Time Zone</Label>
                                    <Input id="time-zone" defaultValue="UTC+1 (West Africa)" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Coins className="h-5 w-5 mr-2 text-green-500" /> Marketplace & Commissions
                            </CardTitle>
                            <CardDescription>Defining the financial rules for platform trade.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border">
                                <div>
                                    <p className="text-sm font-bold">Standard Transaction Fee</p>
                                    <p className="text-[10px] text-zinc-500">Applied to every marketplace purchase.</p>
                                </div>
                                <div className="w-24">
                                    <Input defaultValue="2.5%" className="text-right font-bold" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border">
                                <div>
                                    <p className="text-sm font-bold">Minimum Payout Threshold</p>
                                    <p className="text-[10px] text-zinc-500">Required balance for merchant withdrawal.</p>
                                </div>
                                <div className="w-24">
                                    <Input defaultValue="$50.00" className="text-right font-bold" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border">
                                <div>
                                    <p className="text-sm font-bold">Bulk Purchase Discount (Default)</p>
                                    <p className="text-[10px] text-zinc-500">Auto-suggested discount for large orders.</p>
                                </div>
                                <div className="w-24">
                                    <Input defaultValue="10%" className="text-right font-bold" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Smartphone className="h-5 w-5 mr-2 text-purple-500" /> Mobile & Push
                            </CardTitle>
                            <CardDescription>Integrations for mobile engagement and app behavior.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest text-zinc-400">Push Notification Provider</Label>
                                <div className="flex items-center space-x-2 p-2 px-3 rounded-lg border bg-zinc-50 dark:bg-zinc-900">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-sm font-medium">Firebase Cloud Messaging (Connected)</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sms-api">SMS Gateway API Key</Label>
                                <Input id="sms-api" type="password" defaultValue="************************" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Database className="h-5 w-5 mr-2 text-orange-500" /> Advanced & Maintenance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Maintenance Mode</span>
                                    <div className="h-6 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800 relative cursor-pointer">
                                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Allow New Registrations</span>
                                    <div className="h-6 w-11 rounded-full bg-green-500 relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Debug Logging</span>
                                    <div className="h-6 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800 relative cursor-pointer">
                                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t space-y-2">
                                <Button className="w-full bg-red-600 hover:bg-red-700 font-bold uppercase text-xs h-9">
                                    Purge System Cache
                                </Button>
                                <Button variant="outline" className="w-full text-xs h-9">
                                    Download Database Backup (SQL)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
