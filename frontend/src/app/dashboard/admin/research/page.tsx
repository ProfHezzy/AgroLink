"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    Database,
    FileText,
    Share2,
    Settings,
    CheckCircle,
    Clock,
    ExternalLink,
    Plus
} from "lucide-react";

/**
 * Research & Data Control Page
 * Managing academic contributions and high-level platform insights.
 */
export default function ResearchDataControlPage() {
    const recentResearch = [
        { id: 1, title: "Climate Impact on Maize Yields in Kano", author: "Dr. Ahmed Musa", status: "Published", date: "2026-02-01", downloads: 452 },
        { id: 2, title: "Price Elasticity of Tomatoes in Lagos Markets", author: "Prof. Sarah King", status: "Under Review", date: "2026-02-03", downloads: 0 },
        { id: 3, title: "Adoption of Drip Irrigation in Southwest Nigeria", author: "Engr. David Balogun", status: "Published", date: "2026-01-25", downloads: 1240 },
        { id: 4, title: "Blockchain in Agricultural Supply Chains", author: "Dr. Linda Chen", status: "Revision Required", date: "2026-01-20", downloads: 0 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Research & Data Control</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Managing regional intelligence and academic contributions.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Database className="mr-2 h-4 w-4" />
                        Data Export
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" />
                        New Data Source
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Research Submissions</CardTitle>
                                <CardDescription>Moderating academic and fieldwork contributions.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-green-600">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentResearch.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                    <div className="flex items-start space-x-4">
                                        <div className="mt-1 h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                                            <p className="text-xs text-zinc-500 mt-0.5">by {item.author} • {item.date}</p>
                                            <div className="flex items-center mt-2 space-x-3">
                                                <Badge className={`${item.status === "Published" ? "bg-green-100 text-green-700" :
                                                        item.status === "Under Review" ? "bg-blue-100 text-blue-700" :
                                                            "bg-orange-100 text-orange-700"
                                                    } px-2 py-0 text-[10px] uppercase font-bold`}>
                                                    {item.status}
                                                </Badge>
                                                <span className="text-[10px] text-zinc-400 font-medium">{item.downloads} downloads</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2" /> Data Indexing Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Pricing Index</span>
                                        <span className="text-green-600">98% Synced</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[98%] rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Demand Forecast</span>
                                        <span className="text-green-600">Healthy</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[85%] rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Weather API Data</span>
                                        <span className="text-orange-500">Latency Warning</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-orange-500 h-full w-[45%] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center">
                                <Settings className="h-4 w-4 mr-2 text-green-400" /> Algorithm Control
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-zinc-400">Manage how data is processed, weighted, and presented to researchers.</p>
                            <Button variant="outline" className="w-full text-xs text-white border-zinc-700 hover:bg-zinc-800">
                                Data Weighting Engine
                            </Button>
                            <Button variant="outline" className="w-full text-xs text-white border-zinc-700 hover:bg-zinc-800">
                                Privacy Masking Rules
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
