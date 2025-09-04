"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatBar from "../../components/ChatBar";
import Conversation from "../../components/Conversation";
import { fetchTicket } from "../../../hooks/useHttp";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export default function SupportChat({ conversation }) {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const {data, isLoading, error} = useQuery({
    queryKey: ["ticket", conversation],
    queryFn: ({signal}) => fetchTicket({signal, ticketId: conversation})
  });

  // async function handleSendMessage(text) {
  //   if (!text || !text.trim()) return;
  //   setMessageStatus("loading");
  //   try {
  //     handleSentMessage(text);
  //     setMessageStatus("success");
  //     setMessage("");
  //     setTimeout(() => setMessageStatus("default"), 800);
  //   } catch (err) {
  //     setMessageStatus("error");
  //     setTimeout(() => setMessageStatus("default"), 1200);
  //   }
  // }

  return (
    <LayoutGroup>
      <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl">
        {/* Konuşma üst bilgisi */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Müşteri</div>
              <div className="text-base font-semibold text-gray-900">{data?.userId}</div>
            </div>
            <div className="text-xs text-gray-500">Konu: {data?.topic}</div>
          </div>
        </div>

        {/* Mesajlar */}
        <Conversation conversationId={conversation} isSupport={true} />

        {/* ChatBar */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={"chatbar-bottom"}
            layout
            layoutId="support-chatbar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y:  -8 }}
            className={"px-4 pb-4"}
          >
            <ChatBar
              message={message}
              setMessage={setMessage}
              error={undefined}
              messageStatus={messageStatus}
              setMessageStatus={setMessageStatus}
              handleSendMessage={undefined}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

