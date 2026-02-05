"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar, NavItem } from "@/components/dashboard/DashboardSidebar";
import {
    LayoutDashboard,
    TrendingUp,
    BarChart3,
    LineChart,
    FileText,
    PieChart,
    ClipboardList,
    MessageSquare,
    Database,
    Bell,
    User
} from "lucide-react";

/**
 * Researcher Dashboard Layout
 */
export default function ResearcherDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/auth/login");
            return;
        }

        const parsedUser = JSON.parse(userData);

        if (parsedUser.role !== "RESEARCHER") {
            router.push("/auth/login");
            return;
        }

        setUser(parsedUser);
        setLoading(false);
    }, [router]);

    const navItems: NavItem[] = [
        {
            title: "Dashboard Overview",
            href: "/dashboard/researcher",
            icon: LayoutDashboard,
        },
        {
            title: "Market Insights",
            href: "/dashboard/researcher/insights",
            icon: TrendingUp,
        },
        {
            title: "Data Analytics",
            href: "/dashboard/researcher/analytics",
            icon: BarChart3,
        },
        {
            title: "Price Trends",
            href: "/dashboard/researcher/trends",
            icon: LineChart,
        },
        {
            title: "Demand & Supply Reports",
            href: "/dashboard/researcher/reports",
            icon: PieChart,
        },
        {
            title: "Publish Research",
            href: "/dashboard/researcher/publish",
            icon: FileText,
        },
        {
            title: "Surveys & Polls",
            href: "/dashboard/researcher/surveys",
            icon: ClipboardList,
        },
        {
            title: "Forum",
            href: "/dashboard/researcher/forum",
            icon: MessageSquare,
        },
        {
            title: "Saved Datasets",
            href: "/dashboard/researcher/datasets",
            icon: Database,
        },
        {
            title: "Notifications",
            href: "/dashboard/researcher/notifications",
            icon: Bell,
            badge: 3,
        },
        {
            title: "Profile & Settings",
            href: "/dashboard/researcher/settings",
            icon: User,
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
            <DashboardSidebar
                navItems={navItems}
                userRole="RESEARCHER"
                userName={user?.fullName || "Researcher"}
                userEmail={user?.email || ""}
            />
            <main className="md:ml-72 min-h-screen pt-20 md:pt-0">
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
