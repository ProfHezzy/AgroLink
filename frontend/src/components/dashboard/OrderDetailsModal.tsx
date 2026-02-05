"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    User,
    MapPin,
    Calendar,
    CreditCard,
    Package,
    CheckCircle2,
    Truck,
    PackageCheck,
    ShieldCheck,
    Printer,
    ChevronRight,
    Info,
    ReceiptText,
    Boxes
} from "lucide-react";
import { API_URL } from "@/lib/api";

interface OrderDetailsModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    userRole: 'FARMER' | 'BUYER' | 'ADMIN';
}

export function OrderDetailsModal({ order, isOpen, onClose, userRole }: OrderDetailsModalProps) {
    if (!order) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            case "SHIPPED": return "text-blue-600 bg-blue-50 border-blue-100";
            case "PENDING": return "text-amber-600 bg-amber-50 border-amber-100";
            case "CANCELLED": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-zinc-600 bg-zinc-50 border-zinc-100";
        }
    };

    const statuses = ['PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED'];
    const currentStatusIndex = statuses.indexOf(order.status);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1400px] w-[98vw] h-fit max-h-[92vh] !flex !flex-col !gap-0 p-0 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xl border-0 !translate-y-[-50%] !top-[50%] !translate-x-[-50%] !left-[50%]">
                {/* --- Scrollbar Styling --- */}
                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #cbd5e1;
                    }
                    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #3f3f46;
                    }
                `}</style>

                {/* --- Fixed Header --- */}
                <div className="px-8 py-5 border-b shrink-0 bg-white dark:bg-zinc-950 z-30">
                    <div className="max-w-[1300px] mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center text-white shrink-0">
                                <ReceiptText className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                    Order <span className="text-green-600">#{order.id.slice(0, 8).toUpperCase()}</span>
                                </DialogTitle>
                                <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                                    Authenticated: {order.id.slice(0, 12)}...
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(order.status)} border px-2 py-0.5 font-black uppercase tracking-widest text-[9px]`}>
                                {order.status}
                            </Badge>
                            <button onClick={() => window.print()} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400">
                                <Printer className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Scrollable Content Body --- */}
                <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-zinc-900/40 custom-scrollbar min-h-0">
                    <div className="max-w-[1300px] mx-auto p-8 space-y-8">

                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border shadow-sm space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Valuation</p>
                                <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">${parseFloat(order.total).toFixed(2)}</p>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border shadow-sm space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Registered</p>
                                <p className="text-lg font-black text-zinc-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border shadow-sm space-y-1 text-blue-600">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Payload</p>
                                <p className="text-lg font-black">{order.items?.length || 0} Batches</p>
                            </div>
                        </div>

                        {/* Manifest & Route */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-3 space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Logistics Manifest</h3>
                                <div className="space-y-2">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white dark:bg-zinc-900 p-3 rounded-xl border flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-lg bg-zinc-50 border overflow-hidden shrink-0">
                                                {item.product.images?.[0] ? (
                                                    <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-[8px] font-bold text-zinc-300">N/A</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-xs text-zinc-900 dark:text-white truncate uppercase">{item.product.name}</h4>
                                                <p className="text-[10px] text-zinc-400 font-bold">{item.quantity} UNITS @ ${parseFloat(item.price).toFixed(2)}</p>
                                            </div>
                                            <p className="font-black text-sm text-zinc-900 dark:text-white">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border space-y-3">
                                    <h3 className="text-[10px] font-black uppercase text-zinc-400">Recipient</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-black text-xs">{(order.buyer?.fullName || 'U')[0]}</div>
                                        <p className="font-bold text-zinc-900 dark:text-white text-xs">{order.buyer?.fullName || 'Anonymous'}</p>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase">Destination</p>
                                        <p className="text-xs font-bold text-zinc-600 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {order.buyer?.location || 'Direct'}</p>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 p-5 rounded-2xl text-white space-y-3">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-zinc-500 font-bold uppercase">Consignment</span>
                                        <span>${(parseFloat(order.total) - 15).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-zinc-500 font-bold uppercase">Logistics</span>
                                        <span className="text-green-500">$15.00</span>
                                    </div>
                                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                                        <span className="font-black uppercase text-[10px]">Total</span>
                                        <span className="text-xl font-black">${parseFloat(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lifecycle Stepper */}
                        <div className="space-y-4 pt-4">
                            <div className="relative flex justify-between items-center px-2">
                                <div className="absolute left-0 right-0 top-3 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
                                <div className="absolute left-0 top-3 h-0.5 bg-green-500 transition-all duration-700" style={{ width: `${(currentStatusIndex / 3) * 100}%` }} />
                                {statuses.map((step, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 relative z-10 px-2 bg-[#f8fafc] dark:bg-zinc-900">
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${i <= currentStatusIndex ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-zinc-200 text-zinc-200'}`}>
                                            <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                        <span className={`text-[8px] font-black uppercase ${i <= currentStatusIndex ? 'text-green-600' : 'text-zinc-400'}`}>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Sticky Footer --- */}
                <div className="px-8 py-6 border-t shrink-0 bg-white dark:bg-zinc-950 z-40">
                    <div className="flex items-center justify-between gap-6 max-w-[1300px] mx-auto w-full">
                        <Button variant="ghost" onClick={onClose} className="px-6 h-10 rounded-xl font-black uppercase tracking-widest text-[9px] text-zinc-400">Exit Ticket</Button>

                        <div className="flex gap-2">
                            {userRole === 'FARMER' && order.status === 'PENDING' && (
                                <Button onClick={async () => {
                                    const token = localStorage.getItem("access_token");
                                    const res = await fetch(`${API_URL}/orders/${order.id}/approve`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                                    if (res.ok) { onClose(); window.location.reload(); }
                                }} className="h-10 px-6 rounded-xl !bg-blue-600 !text-white font-black uppercase tracking-widest text-[9px]">Approve</Button>
                            )}
                            {userRole === 'FARMER' && order.status === 'APPROVED' && (
                                <Button onClick={async () => {
                                    const token = localStorage.getItem("access_token");
                                    const res = await fetch(`${API_URL}/orders/${order.id}/ship`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                                    if (res.ok) { onClose(); window.location.reload(); }
                                }} className="h-10 px-6 rounded-xl !bg-amber-600 !text-white font-black uppercase tracking-widest text-[9px]">Ship</Button>
                            )}
                            {userRole === 'BUYER' && order.paymentStatus === 'UNPAID' && (
                                <Button onClick={async () => {
                                    const token = localStorage.getItem("access_token");
                                    const res = await fetch(`${API_URL}/orders/${order.id}/pay`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                                    if (res.ok) { onClose(); window.location.reload(); }
                                }} className="h-10 px-6 rounded-xl !bg-orange-600 !text-white font-black uppercase tracking-widest text-[9px]">Pay Now</Button>
                            )}
                            {userRole === 'BUYER' && order.status === 'SHIPPED' && (
                                <Button onClick={async () => {
                                    const token = localStorage.getItem("access_token");
                                    const res = await fetch(`${API_URL}/orders/${order.id}/confirm`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                                    if (res.ok) { onClose(); window.location.reload(); }
                                }} className="h-10 px-6 rounded-xl !bg-green-600 !text-white font-black uppercase tracking-widest text-[9px]">Confirm Receipt</Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
