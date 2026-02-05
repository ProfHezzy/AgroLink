"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    MessageSquare,
    Send,
    User,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    Smile,
    ArrowLeft,
    Clock
} from "lucide-react";

export default function FarmerMessagesPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch - typically connects to /chat/conversations
        setTimeout(() => {
            setConversations([
                { id: 1, name: "Alice Johnson", lastMsg: "Is the sweet corn still available in bulk?", time: "10:30 AM", unread: 2, avatar: null },
                { id: 2, name: "Bob Smith", lastMsg: "Thank you for the fast delivery!", time: "Yesterday", unread: 0, avatar: null },
                { id: 3, name: "Green Valley Grocery", lastMsg: "We'd like to discuss a weekly contract.", time: "2 days ago", unread: 0, avatar: null }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6 overflow-hidden">
            {/* Sidebar: Chat List */}
            <Card className={`flex-shrink-0 w-full md:w-80 flex flex-col border-zinc-200 dark:border-zinc-800 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <CardHeader className="pb-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Direct Messages</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare className="h-4 w-4" /></Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input placeholder="Search buyers..." className="pl-10 h-10 text-xs bg-zinc-50 border-0" />
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-green-600 rounded-full" /></div>
                    ) : (
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-900 border-b">
                            {conversations.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors ${selectedChat?.id === chat.id ? 'bg-green-50/50 dark:bg-green-950/20 border-l-4 border-l-green-600' : ''}`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                        <User className="h-6 w-6 text-zinc-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="text-sm font-bold truncate">{chat.name}</h4>
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase">{chat.time}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate mt-0.5">{chat.lastMsg}</p>
                                    </div>
                                    {chat.unread > 0 && <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center text-[10px] text-white font-black">{chat.unread}</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className={`flex-1 flex flex-col border-zinc-200 dark:border-zinc-800 transition-all ${!selectedChat ? 'hidden md:flex bg-zinc-50/30' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-zinc-900 z-10">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setSelectedChat(null)}><ArrowLeft className="h-4 w-4" /></Button>
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                    {selectedChat.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black">{selectedChat.name}</h3>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400"><Phone className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400"><Video className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400"><MoreVertical className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Messages Content */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-80">
                            <div className="flex justify-center"><Badge variant="outline" className="text-[10px] font-bold uppercase text-zinc-400 bg-white">Today</Badge></div>

                            <div className="flex flex-col gap-4">
                                <div className="max-w-[80%] bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none border shadow-sm">
                                    <p className="text-sm font-medium">{selectedChat.lastMsg}</p>
                                    <div className="flex justify-end mt-1"><span className="text-[9px] text-zinc-400 font-bold uppercase">{selectedChat.time}</span></div>
                                </div>

                                <div className="max-w-[80%] self-end bg-green-600 text-white p-4 rounded-2xl rounded-tr-none shadow-xl">
                                    <p className="text-sm font-medium">Hello! Yes, the harvest was great this morning. How many tons were you looking for?</p>
                                    <div className="flex justify-end mt-1"><span className="text-[9px] text-green-200 font-bold uppercase">10:35 AM • READ</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t">
                            <div className="relative flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <Input placeholder="Type a message..." className="h-12 pl-4 pr-12 rounded-2xl border-zinc-200 shadow-sm focus-visible:ring-green-500" />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400"><Smile className="h-5 w-5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400"><Paperclip className="h-5 w-5" /></Button>
                                    </div>
                                </div>
                                <Button className="h-12 w-12 rounded-2xl bg-green-600 hover:bg-green-700 shadow-xl flex-shrink-0">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <MessageSquare className="h-10 w-10" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Select a conversation</h3>
                            <p className="text-sm text-zinc-500">Pick a buyer to start negotiating deals and answering questions.</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
