"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    BarChart3,
    FileText,
    Database,
    LineChart,
    PieChart,
    Download,
    Eye
} from "lucide-react";

/**
 * Researcher Dashboard Overview Page
 */
export default function ResearcherDashboardPage() {
    const [stats, setStats] = useState({
        publishedResearch: 0,
        savedDatasets: 0,
        activeSurveys: 0,
        totalDownloads: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setStats({
            publishedResearch: 12,
            savedDatasets: 28,
            activeSurveys: 5,
            totalDownloads: 1543,
        });
    };

    const statCards = [
        {
            title: "Published Research",
            value: stats.publishedResearch,
            subtitle: "Total publications",
            icon: FileText,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-950",
        },
        {
            title: "Saved Datasets",
            value: stats.savedDatasets,
            subtitle: "Available for analysis",
            icon: Database,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-950",
        },
        {
            title: "Active Surveys",
            value: stats.activeSurveys,
            subtitle: "Currently running",
            icon: BarChart3,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-950",
        },
        {
            title: "Total Downloads",
            value: stats.totalDownloads.toLocaleString(),
            subtitle: "Research downloads",
            icon: Download,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-950",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                        Researcher Dashboard
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Access market data, analytics, and publish research
                    </p>
                </div>
                <Link href="/dashboard/researcher/publish">
                    <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Publish Research
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {stat.subtitle}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Market Price Trends</CardTitle>
                        <CardDescription>Top commodities this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Rice", trend: "up", change: "+12.5%", price: "$25.99" },
                                { name: "Corn", trend: "up", change: "+8.2%", price: "$18.50" },
                                { name: "Tomatoes", trend: "down", change: "-3.1%", price: "$5.99" },
                                { name: "Wheat", trend: "up", change: "+15.7%", price: "$22.00" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${item.trend === "up" ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950"}`}>
                                            <TrendingUp className={`h-4 w-4 ${item.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400 rotate-180"}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                Current: {item.price}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={
                                            item.trend === "up"
                                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                                        }
                                    >
                                        {item.change}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Link href="/dashboard/researcher/trends">
                            <Button variant="outline" className="w-full mt-4">
                                <Eye className="mr-2 h-4 w-4" />
                                View Detailed Trends
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Research */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Publications</CardTitle>
                        <CardDescription>Your latest research papers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "Agricultural Market Analysis Q1 2026", downloads: 234, date: "2 days ago" },
                                { title: "Price Volatility in Grain Markets", downloads: 189, date: "1 week ago" },
                                { title: "Supply Chain Efficiency Study", downloads: 156, date: "2 weeks ago" },
                                { title: "Climate Impact on Crop Yields", downloads: 298, date: "3 weeks ago" },
                            ].map((paper, i) => (
                                <div key={i} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                                        {paper.title}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {paper.downloads} downloads • {paper.date}
                                        </p>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/dashboard/researcher/publish">
                            <Button variant="outline" className="w-full mt-4">
                                View All Publications
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Data Visualization Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Market Analytics Dashboard</CardTitle>
                    <CardDescription>Comprehensive market data visualization</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: "Price Trends", icon: LineChart, color: "text-blue-600" },
                            { title: "Supply & Demand", icon: BarChart3, color: "text-green-600" },
                            { title: "Market Share", icon: PieChart, color: "text-purple-600" },
                        ].map((chart) => {
                            const Icon = chart.icon;
                            return (
                                <div key={chart.title} className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors">
                                    <Icon className={`h-12 w-12 ${chart.color} mb-2`} />
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {chart.title}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                        Coming soon
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common research tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "View Analytics", href: "/dashboard/researcher/analytics", icon: BarChart3 },
                            { label: "Price Trends", href: "/dashboard/researcher/trends", icon: LineChart },
                            { label: "Create Survey", href: "/dashboard/researcher/surveys", icon: FileText },
                            { label: "Export Data", href: "/dashboard/researcher/datasets", icon: Database },
                        ].map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.label} href={action.href}>
                                    <button className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 group w-full">
                                        <Icon className="h-8 w-8 text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-400 mb-2" />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-green-700 dark:group-hover:text-green-400 text-center">
                                            {action.label}
                                        </span>
                                    </button>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
