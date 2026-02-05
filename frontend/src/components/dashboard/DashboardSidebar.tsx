"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Menu,
    Sprout,
    LogOut,
    Bell,
    ChevronLeft,
    LucideIcon
} from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Navigation Item Interface
 * Defines the structure for sidebar navigation items
 */
export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
}

/**
 * DashboardSidebar Component Props
 */
interface DashboardSidebarProps {
    navItems: NavItem[];
    userRole: string;
    userName?: string;
    userEmail?: string;
}

/**
 * DashboardSidebar Component
 * Reusable sidebar navigation for all dashboard types
 * Features: Responsive, collapsible, mobile-friendly
 */
export function DashboardSidebar({
    navItems,
    userRole,
    userName = "User",
    userEmail = ""
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    /**
     * Handle user logout
     * Clears localStorage and redirects to login
     */
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        router.push("/auth/login");
    };

    /**
     * Get user initials for avatar
     */
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    /**
     * Get role badge color
     */
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
            case "FARMER":
                return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
            case "BUYER":
                return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
            case "RESEARCHER":
                return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
            default:
                return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    /**
     * Sidebar Content Component
     * Shared between desktop and mobile views
     */
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo and Brand */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition-colors">
                        <Sprout className="h-6 w-6 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                                AgroLink
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {userRole} Portal
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-green-500">
                        <AvatarFallback className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 font-semibold">
                            {getInitials(userName)}
                        </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {userName}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {userEmail}
                            </p>
                            <Badge className={cn("mt-1 text-xs", getRoleBadgeColor(userRole))}>
                                {userRole}
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                isActive && "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-semibold",
                                !isActive && "text-zinc-700 dark:text-zinc-300"
                            )}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.title}</span>
                                    {item.badge && (
                                        <Badge variant="secondary" className="ml-auto">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    {!collapsed && "Logout"}
                </Button>
            </div>
        </div>
    );

    // Mobile View
    if (isMobile) {
        return (
            <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-green-600 p-2 rounded-lg">
                            <Sprout className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                            AgroLink
                        </span>
                    </Link>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop View
    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 z-40",
                collapsed ? "w-20" : "w-72"
            )}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <ChevronLeft
                    className={cn(
                        "h-4 w-4 text-zinc-600 dark:text-zinc-400 transition-transform",
                        collapsed && "rotate-180"
                    )}
                />
            </button>

            <SidebarContent />
        </aside>
    );
}
