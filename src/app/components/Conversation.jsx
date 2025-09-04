"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchConversation } from "../../hooks/useHttp";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

function bubbleStyle(sender, isSupport) {
    const isSystem = sender === "System";
    const isCustomer = sender === "Customer";

    if (isSupport) {
        if (isSystem) return { align: "right", bubble: "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" };
        if (isCustomer) return { align: "left", bubble: "bg-white text-zinc-900 border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800" };
        return { align: "right", bubble: "bg-gradient-to-br from-zinc-900 to-zinc-700 text-white dark:from-zinc-700 dark:to-zinc-600" };
    }

    if (isSystem) return { align: "left", bubble: "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" };
    if (isCustomer) return { align: "right", bubble: "bg-zinc-900 text-white shadow-sm dark:bg-zinc-700" };
    return { align: "left", bubble: "bg-white text-zinc-900 border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800" };
}

export default function Conversation({ conversationId, isSupport = false, className = "" }) {

    const { data, isLoading, error } = useQuery({
        queryKey: ['conversation', conversationId],
        queryFn: ({ signal }) => fetchConversation({ signal, ticketId: conversationId }),
        enabled: Boolean(conversationId)
    })

    const containerRef = useRef(null);

    // Auto-scroll on new messages
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !data) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [data?.length]);

    if (error === "No messages found") {
        return (
            <div className={`flex h-full w-full items-center justify-center ${className}`}>
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    No messages found
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`h-full w-full overflow-y-auto p-3 flex flex-col justify-end space-y-3 ${className}`}>
            {(data ?? []).map((message, index) => {
                const { align, bubble } = bubbleStyle(message.sender, isSupport);
                const isNewMessage = index === (data ?? []).length - 1;
                
                return isNewMessage ? (
                    <motion.div
                        key={message.id}
                        className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className={`relative max-w-[78%] sm:max-w-[68%] rounded-2xl px-4 py-2 pb-4 pr-10 shadow-sm ${bubble}`}>
                            <p className="whitespace-pre-wrap break-words text-[13.5px] leading-relaxed">
                                {message.message}
                            </p>

                            <span className="absolute bottom-1 right-2 text-[10px] opacity-60">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </motion.div>
                ) : (
                    <div
                        key={message.id}
                        className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`relative max-w-[78%] sm:max-w-[68%] rounded-2xl px-4 py-2 pb-4 pr-10 shadow-sm ${bubble}`}>
                            <p className="whitespace-pre-wrap break-words text-[13.5px] leading-relaxed">
                                {message.message}
                            </p>

                            <span className="absolute bottom-1 right-2 text-[10px] opacity-60">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
