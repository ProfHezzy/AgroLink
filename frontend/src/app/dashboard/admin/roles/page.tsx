"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Plus,
    Edit
} from "lucide-react";

/**
 * Roles & Permissions Page
 * Overview of system roles and their respective permissions.
 */
export default function RolesPermissionsPage() {
    const roles = [
        {
            name: "ADMIN",
            description: "Full system access, user management, and platform oversight.",
            icon: ShieldAlert,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/20",
            permissions: [
                "Create/Read/Update/Delete all entities",
                "Manage roles and permissions",
                "Access system logs and security settings",
                "Moderate forum and research posts",
                "Override any system action"
            ]
        },
        {
            name: "FARMER",
            description: "Sellers of agricultural products and contributors of research.",
            icon: ShieldCheck,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950/20",
            permissions: [
                "Manage personal product inventory",
                "Process customer orders",
                "View earnings and payouts",
                "Publish research observations",
                "Participate in community forums"
            ]
        },
        {
            name: "BUYER",
            description: "Consumers, wholesalers, and individuals purchasing produce.",
            icon: CheckCircle2,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            permissions: [
                "Browse and search marketplace",
                "Place bulk and individual orders",
                "Rate and review products/farmers",
                "Manage personal profile and cart",
                "Access community forum"
            ]
        },
        {
            name: "RESEARCHER",
            description: "Specialists analyzing market data and regional insights.",
            icon: Shield,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
            permissions: [
                "Access aggregated market data",
                "Publish detailed research papers",
                "Create and manage surveys/polls",
                "Analyze demand and supply trends",
                "Expert badge in forum discussions"
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Roles & Permissions</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Manage system roles and the fine-grained permissions assigned to them.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Role
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                        <Card key={role.name} className="overflow-hidden">
                            <CardHeader className={`${role.bgColor} border-b`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg bg-white dark:bg-zinc-900 shadow-sm`}>
                                            <Icon className={`h-6 w-6 ${role.color}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">{role.name}</CardTitle>
                                            <CardDescription className="font-medium text-zinc-600 dark:text-zinc-400">
                                                System Level Role
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 italic">
                                    "{role.description}"
                                </p>

                                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
                                    <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                                    Enabled Permissions
                                </h4>

                                <div className="space-y-3">
                                    {role.permissions.map((permission, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="ml-3 text-sm text-zinc-700 dark:text-zinc-300">
                                                {permission}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <ShieldAlert className="h-12 w-12 text-zinc-300 mb-4" />
                    <h3 className="text-xl font-semibold text-zinc-400">Looking to scale?</h3>
                    <p className="text-zinc-500 max-w-md mt-2">
                        You can define custom roles with granular access controls to better segment your team's responsibilities.
                    </p>
                    <Button variant="outline" className="mt-6 border-green-500 text-green-600 hover:bg-green-50">
                        View Permission Registry
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
