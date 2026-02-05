"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sprout, ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/marketplace", label: "Marketplace" },
        { href: "/research", label: "Research" },
        { href: "/community", label: "Community" },
        { href: "/about", label: "About" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800"
                    : "bg-transparent border-transparent"
                }`}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition-colors">
                        <Sprout className="h-6 w-6 text-white" />
                    </div>
                    <span className={`text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500 ${!scrolled && pathname === "/" ? "text-white" : "text-green-700 dark:text-green-400"}`}>
                        AgroLink
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-green-600 ${pathname === link.href
                                    ? "text-green-600"
                                    : !scrolled && pathname === "/"
                                        ? "text-white/90 hover:text-white"
                                        : "text-zinc-600 dark:text-zinc-300"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className={!scrolled && pathname === "/" ? "text-white hover:bg-white/10" : ""}>
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
                    <Link href="/auth/login">
                        <Button variant="ghost" className={!scrolled && pathname === "/" ? "text-white hover:bg-white/10 hover:text-white" : ""}>
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={!scrolled && pathname === "/" ? "text-white hover:bg-white/10" : ""}>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col space-y-8 mt-10">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium text-zinc-800 dark:text-zinc-200 hover:text-green-600"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="flex flex-col space-y-4 pt-8 border-t">
                                    <Link href="/auth/login">
                                        <Button variant="outline" className="w-full justify-start">
                                            <User className="mr-2 h-4 w-4" /> Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            Join Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
