"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Users,
    Search,
    MoreHorizontal,
    UserPlus,
    Filter,
    Trash2,
    Edit,
    Mail,
    MapPin
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

/**
 * User Management Page
 * Allows admins to view, search, filter, and manage all users.
 */
export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:3001/users", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
            case "FARMER": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
            case "BUYER": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
            case "RESEARCHER": return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">User Management</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">View and manage all registered users in the platform.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search by name, email or role..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Activity</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400">
                                                            {user.fullName?.charAt(0) || "U"}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.fullName || "N/A"}</div>
                                                            <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center">
                                                                <Mail className="h-3 w-3 mr-1" />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getRoleBadgeColor(user.role)}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {user.location || "Not specified"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs space-y-1">
                                                        <div className="text-zinc-500">Products: {user._count?.products || 0}</div>
                                                        <div className="text-zinc-500">Orders: {user._count?.orders || 0}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Mail className="mr-2 h-4 w-4" /> Send Message
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                                                No users found matching your search.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
