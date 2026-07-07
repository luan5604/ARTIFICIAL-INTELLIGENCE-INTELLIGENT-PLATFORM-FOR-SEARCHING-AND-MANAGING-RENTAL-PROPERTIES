"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Send, 
  MoreVertical, 
  User, 
  CheckCheck,
  Bot,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/api.service";
import { useAuth } from "@/components/providers/auth-provider";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  const fetchConversations = async (shouldSetActive = false) => {
    try {
      const res = await chatService.getConversations();
      setConversations(res.data);
      if (shouldSetActive && res.data.length > 0 && !activeChat) {
        setActiveChat(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(true);
  }, []);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const res = await chatService.getMessages(activeChat.id);
          // Only update and fetch conversations if we got new messages
          if (res.data.length !== messages.length) {
            setMessages(res.data);
            fetchConversations();
          }
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      };
      fetchMessages();
      // Polling for new messages every 5 seconds (primitive real-time)
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;

    setSending(true);
    try {
      const res = await chatService.sendMessage({
        conversation_id: activeChat.id,
        content: newMessage,
        room_id: activeChat.room_id
      });
      
      // Update local messages immediately
      const sentMsgs = res.data.botMessage 
        ? [res.data.userMessage, res.data.botMessage] 
        : [res.data.userMessage];
      
      setMessages(prev => [...prev, ...sentMsgs]);
      setNewMessage("");
      // Refresh sidebar to show latest message preview
      fetchConversations();
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex glass rounded-2xl overflow-hidden premium-shadow">
      {/* Sidebar List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-white/2">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm hội thoại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg outline-none text-sm focus:border-primary transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
          ) : conversations.length > 0 ? (
            conversations
              .filter(chat => {
                const otherUser = currentUser?.id === chat.landlord_id ? chat.tenant : chat.landlord;
                const otherName = (otherUser?.Profile?.full_name || otherUser?.email || "").toLowerCase();
                return otherName.includes(searchTerm.toLowerCase());
              })
              .map((chat) => {
                const otherUser = currentUser?.id === chat.landlord_id ? chat.tenant : chat.landlord;
              const otherName = otherUser?.Profile?.full_name || otherUser?.email || "Người dùng";
              const lastMsg = chat.Messages?.[0];

              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChat(chat)}
                  className={cn(
                    "p-4 flex gap-3 hover:bg-white/5 cursor-pointer transition-all border-b border-white/2 relative group",
                    activeChat?.id === chat.id && "bg-white/5"
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary uppercase font-bold">
                      {otherName[0]}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm truncate">
                        {otherName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(lastMsg?.created_at || chat.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {lastMsg?.content || "Chưa có tin nhắn"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">Chưa có hội thoại nào</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-3">
                {(() => {
                  const otherUser = currentUser?.id === activeChat.landlord_id ? activeChat.tenant : activeChat.landlord;
                  const otherName = otherUser?.Profile?.full_name || otherUser?.email || "Người dùng";
                  return (
                    <>
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary uppercase font-bold">
                        {otherName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {otherName}
                          <span className="text-[10px] text-muted-foreground ml-2 block italic">{otherUser?.email}</span>
                        </p>
                        <p className="text-[10px] text-green-400">Đang hoạt động</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/2 flex flex-col">
              {messages.map((msg) => {
                const isSystem = msg.sender_id === null;
                const isMe = msg.sender_id === currentUser?.id;
                const senderName = msg.sender?.Profile?.full_name || msg.sender?.email || (isSystem ? "Hệ thống AI" : "Ẩn danh");

                return (
                  <div key={msg.id} className={cn(
                    "flex flex-col max-w-[80%]",
                    isMe ? "self-end items-end" : "self-start items-start"
                  )}>
                    {!isMe && (
                      <span className="text-[10px] text-muted-foreground mb-1 ml-1 font-medium">
                        {senderName}
                      </span>
                    )}
                    <div className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm break-words shadow-md",
                      isMe 
                        ? "bg-primary text-white rounded-tr-none" 
                        : isSystem
                          ? "bg-blue-600 text-white rounded-tl-none border border-blue-400/30 italic"
                          : "bg-[#2d3748] text-white rounded-tl-none border border-white/10"
                    )}>
                      {msg.content}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 px-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3 text-primary opacity-70" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/5">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all text-sm"
                />
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-3 bg-primary text-white rounded-xl premium-shadow hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
               <User className="w-8 h-8" />
            </div>
            <p>Chọn một hội thoại để bắt đầu nhắn tin</p>
          </div>
        )}
      </div>
    </div>
  );
}
