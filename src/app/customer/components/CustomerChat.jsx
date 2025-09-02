"use client";

import { useState } from "react";
import usePost from "../../../hooks/usePost";
import useMessagesTemp from "../../../hooks/useMessagesTemp";
import ChatBar from "../../components/ChatBar";
import MessageList from "./MessageList";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";

export default function CustomerChat() {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const { loading, data, error, post } = usePost();
  const { hasAnyMessage, handleSentMessage, messages, messagesEndRef, formatTime } = useMessagesTemp();
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";

  async function handleSendMessage() {
    setMessageStatus("loading");

    try {
      await post("http://localhost:5000/api/messages/classify", { Text: message, UserID: username });
      handleSentMessage(message);
      setMessageStatus("success");
      setMessage("");
      setTimeout(() => setMessageStatus("default"), 2000);
    } catch (err) {
      setMessageStatus("error");
      setTimeout(() => setMessageStatus("default"), 2000);
    }
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col h-full">

        <MessageList
          messages={messages}
          messagesEndRef={messagesEndRef}
          formatTime={formatTime}
        />

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={hasAnyMessage ? "chatbar-bottom" : "chatbar-top"} layout layoutId="chatbar"
            initial={{ opacity: 0, y: hasAnyMessage ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: hasAnyMessage ? 8 : -8 }}
            className={hasAnyMessage ? "pt-3" : "mb-20"}
          >
            <ChatBar message={message} setMessage={setMessage} loading={loading} error={error} messageStatus={messageStatus} setMessageStatus={setMessageStatus} handleSendMessage={handleSendMessage} />
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}