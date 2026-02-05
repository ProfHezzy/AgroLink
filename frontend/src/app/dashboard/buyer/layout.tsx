"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar, NavItem } from "@/components/dashboard/DashboardSidebar";
import {
    LayoutDashboard,
    Store,
    ShoppingCart,
    ShoppingBag,
    Package,
    Heart,
    Star,
    MessageSquare,
    Mail,
    Bell,
    User,
    Wallet
} from "lucide-react";
import { API_URL } from "@/lib/api";

/**
 * Buyer Dashboard Layout
 */
export default function BuyerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({ cart: 0, notifications: 0 });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/auth/login");
            return;
        }

        const parsedUser = JSON.parse(userData);

        if (parsedUser.role !== "BUYER") {
            router.push("/auth/login");
            return;
        }

        setUser(parsedUser);
        setLoading(false);
        fetchCounts(token);
    }, [router]);

    const fetchCounts = async (token: string) => {
        try {
            const headers = { "Authorization": `Bearer ${token}` };
            const statsRes = await fetch(`${API_URL}/users/buyer/stats`, { headers });
            if (statsRes.ok) {
                const stats = await statsRes.json();
                const notifyRes = await fetch(`${API_URL}/notifications`, { headers });
                const notifications = await notifyRes.json();
                const unreadCount = notifications.filter((n: any) => !n.read).length;

                setCounts({
                    cart: stats.cartItems || 0,
                    notifications: unreadCount
                });
            }
        } catch (error) {
            console.error("Counts fetch error:", error);
        }
    };

    const navItems: NavItem[] = [
        {
            title: "Dashboard Overview",
            href: "/dashboard/buyer",
            icon: LayoutDashboard,
        },
        {
            title: "Marketplace",
            href: "/marketplace",
            icon: Store,
        },
        {
            title: "Cart",
            href: "/dashboard/buyer/cart",
            icon: ShoppingCart,
            badge: counts.cart > 0 ? counts.cart : undefined,
        },
        {
            title: "Orders",
            href: "/dashboard/buyer/orders",
            icon: ShoppingBag,
        },
        {
            title: "Favorite Sellers",
            href: "/dashboard/buyer/favorites",
            icon: Heart,
        },
        {
            title: "Notifications",
            href: "/dashboard/buyer/notifications",
            icon: Bell,
            badge: counts.notifications > 0 ? counts.notifications : undefined,
        },
        {
            title: "Profile & Settings",
            href: "/dashboard/buyer/settings",
            icon: User,
        },
        {
            title: "Digital Wallet",
            href: "/dashboard/buyer/wallet",
            icon: Wallet,
        },
        {
            title: "Help Center",
            href: "/dashboard/buyer/help-center",
            icon: MessageSquare,
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
                userRole="BUYER"
                userName={user?.fullName || "Buyer"}
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
