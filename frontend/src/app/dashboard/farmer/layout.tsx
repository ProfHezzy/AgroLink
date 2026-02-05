"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar, NavItem } from "@/components/dashboard/DashboardSidebar";
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    Warehouse,
    ShoppingBag,
    DollarSign,
    Star,
    FileText,
    MessageSquare,
    Mail,
    Bell,
    User,
    Wallet
} from "lucide-react";

/**
 * Farmer Dashboard Layout
 * Wraps all farmer pages with sidebar navigation
 */
export default function FarmerDashboardLayout({
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

        if (parsedUser.role !== "FARMER") {
            router.push("/auth/login");
            return;
        }

        setUser(parsedUser);
        setLoading(false);
    }, [router]);

    /**
     * Farmer Navigation Items
     */
    const navItems: NavItem[] = [
        {
            title: "Dashboard Overview",
            href: "/dashboard/farmer",
            icon: LayoutDashboard,
        },
        {
            title: "My Products",
            href: "/dashboard/farmer/products",
            icon: Package,
        },
        {
            title: "Add New Product",
            href: "/dashboard/farmer/products/new",
            icon: PlusCircle,
        },
        {
            title: "Inventory Management",
            href: "/dashboard/farmer/inventory",
            icon: Warehouse,
        },
        {
            title: "Orders & Sales",
            href: "/dashboard/farmer/orders",
            icon: ShoppingBag,
            badge: 3,
        },
        {
            title: "Revenue & Wallet",
            href: "/dashboard/farmer/wallet",
            icon: Wallet,
        },
        {
            title: "Reviews & Ratings",
            href: "/dashboard/farmer/reviews",
            icon: Star,
        },
        {
            title: "Research Posts",
            href: "/dashboard/farmer/research",
            icon: FileText,
        },
        {
            title: "Forum",
            href: "/dashboard/farmer/forum",
            icon: MessageSquare,
        },
        {
            title: "Messages",
            href: "/dashboard/farmer/messages",
            icon: Mail,
            badge: 2,
        },
        {
            title: "Notifications",
            href: "/dashboard/farmer/notifications",
            icon: Bell,
            badge: 5,
        },
        {
            title: "Profile & Settings",
            href: "/dashboard/farmer/settings",
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
                userRole="FARMER"
                userName={user?.fullName || "Farmer"}
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
