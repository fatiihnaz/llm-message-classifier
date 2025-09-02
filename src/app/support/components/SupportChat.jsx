"use client";

import { useState } from "react";
import ChatBar from "../../components/ChatBar";
import useMessagesTemp from "../../../hooks/useMessagesTemp";
import MessageList from "../../customer/components/MessageList";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export default function SupportChat({ conversation }) {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const { hasAnyMessage, handleSentMessage, messages, messagesEndRef } = useMessagesTemp();

  async function handleSendMessage(text) {
    if (!text || !text.trim()) return;
    setMessageStatus("loading");

    try {
      handleSentMessage(text);
      setMessageStatus("success");
      setMessage("");
      setTimeout(() => setMessageStatus("default"), 800);
    } catch (err) {
      setMessageStatus("error");
      setTimeout(() => setMessageStatus("default"), 1200);
    }
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl">
        {/* Konuşma üst bilgisi */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Müşteri</div>
              <div className="text-base font-semibold text-gray-900">{conversation?.customer}</div>
            </div>
            <div className="text-xs text-gray-500">Konu: {conversation?.topic}</div>
          </div>
        </div>

        {/* Mesajlar */}
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />

        {/* ChatBar */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={hasAnyMessage ? "chatbar-bottom" : "chatbar-top"}
            layout
            layoutId="support-chatbar"
            initial={{ opacity: 0, y: hasAnyMessage ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: hasAnyMessage ? 8 : -8 }}
            className={hasAnyMessage ? "px-4 pb-4" : "px-4 pt-4 pb-8"}
          >
            <ChatBar
              message={message}
              setMessage={setMessage}
              error={undefined}
              messageStatus={messageStatus}
              setMessageStatus={setMessageStatus}
              handleSendMessage={handleSendMessage}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

