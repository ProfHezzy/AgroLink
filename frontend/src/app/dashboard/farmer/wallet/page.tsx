"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    TrendingUp,
    PiggyBank,
    RefreshCcw,
    Loader2,
    CheckCircle2,
    DollarSign,
    ExternalLink,
    Plus,
    Building2,
    CreditCard
} from "lucide-react";
import { API_URL } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FarmerWalletPage() {
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");

    const [addingPayout, setAddingPayout] = useState(false);
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

    useEffect(() => {
        fetchWallet();
        const interval = setInterval(fetchWallet, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchWallet = async (showSync = false) => {
        if (showSync) setSyncing(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/wallets/my-wallet`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWallet(data);
                if (data.payoutMethods?.length > 0 && !selectedMethod) {
                    setSelectedMethod(data.payoutMethods.find((m: any) => m.isDefault)?.id || data.payoutMethods[0].id);
                }
            }
        } catch (error) {
            console.error("Wallet fetch error:", error);
        } finally {
            setLoading(false);
            if (showSync) setTimeout(() => setSyncing(false), 800);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || !selectedMethod) return;
        setWithdrawing(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/wallets/withdraw`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(withdrawAmount),
                    payoutMethodId: selectedMethod
                })
            });
            if (response.ok) {
                setIsWithdrawModalOpen(false);
                setWithdrawAmount("");
                fetchWallet(true);
            }
        } catch (error) {
            console.error("Withdrawal error:", error);
        } finally {
            setWithdrawing(false);
        }
    };

    const handleAddPayout = async () => {
        if (!bankName || !accountNumber || !accountName) return;
        setAddingPayout(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/wallets/payout-methods`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    bankName,
                    accountNumber,
                    accountName,
                    isDefault: true
                })
            });
            if (response.ok) {
                setIsPayoutModalOpen(false);
                setBankName("");
                setAccountNumber("");
                setAccountName("");
                fetchWallet(true);
            }
        } catch (error) {
            console.error("Payout method error:", error);
        } finally {
            setAddingPayout(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Accessing Farmers Treasury...</p>
            </div>
        );
    }

    const earningsThisMonth = wallet?.transactions
        ?.filter((t: any) => t.type === 'ESCROW_RELEASE' && t.amount > 0)
        ?.reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0) || 0;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-600" /> Revenue Center
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Track your farm sales, released funds, and withdrawal history.</p>
                </div>
                <Button
                    onClick={() => fetchWallet(true)}
                    variant="outline"
                    size="sm"
                    className="h-10 font-bold border-zinc-200 dark:border-zinc-800"
                    disabled={syncing}
                >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin text-green-600' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Stats'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Balance */}
                <Card className="border-0 shadow-2xl bg-zinc-900 text-white overflow-hidden relative group md:col-span-2">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform">
                        <TrendingUp className="h-32 w-32" />
                    </div>
                    <div className="absolute top-4 right-4 flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Virtual Account</span>
                        <span className="text-sm font-mono font-bold text-zinc-400">{wallet?.accountNumber || "GEN-00000000000"}</span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase">{wallet?.bankName || "AgroLink Reserve"}</span>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Available for Withdrawal</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black tracking-tighter">${parseFloat(wallet?.balance || 0).toFixed(2)}</span>
                            <span className="text-green-500 font-bold text-sm">USD</span>
                        </div>
                        <div className="flex gap-4">
                            <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-green-600 hover:bg-green-700 h-12 px-8 font-black uppercase tracking-widest text-xs shadow-xl">
                                        Withdraw Funds
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Withdraw Funds</DialogTitle>
                                        <DialogDescription className="font-bold text-zinc-500">Move your earnings to your bank account.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest">Amount to Withdraw</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="h-12 font-black text-xl"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest">Destination Account</Label>
                                            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                                                <SelectTrigger className="h-12 font-bold">
                                                    <SelectValue placeholder="Select payout method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wallet?.payoutMethods?.map((m: any) => (
                                                        <SelectItem key={m.id} value={m.id} className="font-bold">
                                                            {m.bankName} - {m.accountNumber.slice(-4)}
                                                        </SelectItem>
                                                    ))}
                                                    {(!wallet?.payoutMethods || wallet.payoutMethods.length === 0) && (
                                                        <SelectItem value="none" disabled>No payout methods added</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            className="w-full h-12 bg-green-600 hover:bg-green-700 font-black uppercase tracking-widest"
                                            onClick={handleWithdraw}
                                            disabled={withdrawing || !withdrawAmount || !selectedMethod}
                                        >
                                            {withdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Withdrawal"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isPayoutModalOpen} onOpenChange={setIsPayoutModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="h-12 border-zinc-700 bg-transparent hover:bg-zinc-800 font-black uppercase tracking-widest text-xs">
                                        Payout Settings
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Payout Settings</DialogTitle>
                                        <DialogDescription className="font-bold text-zinc-500">Add a new bank account for withdrawals.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest">Bank Name</Label>
                                            <Input
                                                placeholder="e.g. Chase, First Bank, Kuda"
                                                className="h-11 font-bold"
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest">Account Number</Label>
                                            <Input
                                                placeholder="10-digit number"
                                                className="h-11 font-bold"
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest">Account Name</Label>
                                            <Input
                                                placeholder="Your full legal name"
                                                className="h-11 font-bold"
                                                value={accountName}
                                                onChange={(e) => setAccountName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            className="w-full h-12 bg-zinc-900 hover:bg-black font-black uppercase tracking-widest"
                                            onClick={handleAddPayout}
                                            disabled={addingPayout || !bankName || !accountNumber || !accountName}
                                        >
                                            {addingPayout ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Bank Account"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Secondary Stats */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-xl bg-green-50 dark:bg-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Monthly Earnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-2xl font-black text-green-600 tracking-tight">${earningsThisMonth.toFixed(2)}</h3>
                            <div className="mt-2 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[65%]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-white dark:bg-zinc-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                            <PiggyBank className="h-12 w-12" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pending Escrow</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-2xl font-black text-zinc-400 tracking-tight">${parseFloat(wallet?.escrowBalance || 0).toFixed(2)}</h3>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">Released upon buyer confirmation</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ledger */}
                <Card className="lg:col-span-2 border-0 shadow-xl overflow-hidden">
                    <CardHeader className="border-b bg-zinc-50/50 flex flex-row items-center justify-between py-4">
                        <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <History className="h-5 w-5 text-green-600" /> Revenue Ledger
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">
                            Export CSV
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y relative min-h-[300px]">
                            {wallet?.transactions?.length > 0 ? (
                                wallet.transactions.map((tx: any) => (
                                    <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === 'ESCROW_RELEASE' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-600'
                                                }`}>
                                                {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-sm text-zinc-900 uppercase tracking-tighter">{tx.type.replace('_', ' ')}</p>
                                                    {tx.reference && (
                                                        <span className="text-[9px] bg-zinc-100 px-1.5 py-0.5 rounded font-mono font-bold text-zinc-400">REF: {tx.reference.slice(0, 8)}</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{new Date(tx.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-zinc-900'}`}>
                                                {tx.amount > 0 ? '+' : ''}${parseFloat(tx.amount).toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-1 justify-end">
                                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">{tx.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                    <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                                        <DollarSign className="h-10 w-10 text-zinc-200" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">No revenue recorded yet</p>
                                        <p className="text-zinc-300 text-xs mt-1">Your sales transactions will appear here.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Information */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-xl bg-white dark:bg-zinc-900 p-8 space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Escrow Mechanism</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                Funds from your sales are initially held in <span className="text-zinc-900 font-bold">Safe-Escrow</span>.
                                Once the buyer confirms they've received the produce, the total is instantly released to your wallet minus the platform commission.
                            </p>
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Fee Structure</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-zinc-600">Platform Commission</span>
                                    <span className="font-black text-zinc-900">5.0%</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-zinc-600">Withdrawal Fee</span>
                                    <span className="font-black text-zinc-900">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button variant="outline" className="w-full justify-between h-12 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-50">
                                View Fee Details <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>

                    <div className="p-6 rounded-3xl bg-green-600 text-white shadow-2xl relative overflow-hidden">
                        <TrendingUp className="absolute bottom-[-20px] right-[-20px] h-32 w-32 opacity-10" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Pro Farmer Tip</h4>
                        <p className="text-sm font-bold mt-2 leading-tight">
                            "Speedy delivery confirmation leads to faster payouts. Remind your buyers to confirm receipt!"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
