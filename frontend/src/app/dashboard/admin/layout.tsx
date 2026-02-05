"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar, NavItem } from "@/components/dashboard/DashboardSidebar";
import {
    LayoutDashboard,
    Users,
    Shield,
    Store,
    ShoppingBag,
    BarChart3,
    MessageSquare,
    FileText,
    Bell,
    Settings,
    Lock
} from "lucide-react";

/**
 * Admin Dashboard Layout
 * Wraps all admin pages with sidebar navigation
 * Includes authentication check and role verification
 */
export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Check authentication and role on mount
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/auth/login");
            return;
        }

        const parsedUser = JSON.parse(userData);

        // Verify user is admin
        if (parsedUser.role !== "ADMIN") {
            router.push("/auth/login");
            return;
        }

        setUser(parsedUser);
        setLoading(false);
    }, [router]);

    /**
     * Admin Navigation Items
     * Based on PRD requirements
     */
    const navItems: NavItem[] = [
        {
            title: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            title: "User Management",
            href: "/dashboard/admin/users",
            icon: Users,
        },
        {
            title: "Role & Permissions",
            href: "/dashboard/admin/roles",
            icon: Shield,
        },
        {
            title: "Marketplace Management",
            href: "/dashboard/admin/marketplace",
            icon: Store,
        },
        {
            title: "Orders & Transactions",
            href: "/dashboard/admin/orders",
            icon: ShoppingBag,
        },
        {
            title: "Research & Data Control",
            href: "/dashboard/admin/research",
            icon: BarChart3,
        },
        {
            title: "Forum Moderation",
            href: "/dashboard/admin/forum",
            icon: MessageSquare,
        },
        {
            title: "Reports & Analytics",
            href: "/dashboard/admin/reports",
            icon: FileText,
        },
        {
            title: "Notifications",
            href: "/dashboard/admin/notifications",
            icon: Bell,
            badge: 5,
        },
        {
            title: "System Settings",
            href: "/dashboard/admin/settings",
            icon: Settings,
        },
        {
            title: "Security & Logs",
            href: "/dashboard/admin/security",
            icon: Lock,
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar Navigation */}
            <DashboardSidebar
                navItems={navItems}
                userRole="ADMIN"
                userName={user?.fullName || "Admin User"}
                userEmail={user?.email || ""}
            />

            {/* Main Content Area */}
            <main className="md:ml-72 min-h-screen pt-20 md:pt-0">
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
