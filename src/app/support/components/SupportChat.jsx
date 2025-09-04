"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatBar from "../../components/ChatBar";
import Conversation from "../../components/Conversation";
import { fetchTicket } from "../../../hooks/useHttp";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import AISuggestion from "./AISuggestion";

export default function SupportChat({ conversation }) {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(true);

  useEffect(() => {
    setMessage("");
    setShowSuggestion(true);
  }, [conversation]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", conversation],
    queryFn: ({ signal }) => fetchTicket({ signal, ticketId: conversation })
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
      <div className="flex flex-col h-full bg-white border shadow-md/10 border-gray-200 rounded-xl">
        {/* Konuşma üst bilgisi */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Sol taraf: müşteri bilgisi */}
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Müşteri
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {data?.userId ?? "—"}
              </div>
            </div>

            {/* Sağ taraf: konu ve opsiyonel kargo no */}
            <div className="flex flex-col items-start sm:items-end gap-1">
              <div className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">Konu:</span>{" "}
                {data?.category ?? "—"}
              </div>
              {data?.cargoTrackingNumber && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium text-gray-700">Kargo Takip:</span>{" "}
                  <span className="font-mono">{data.cargoTrackingNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Mesajlar */}
        <Conversation conversationId={conversation} isSupport={true} />

        {showSuggestion && (
          <AISuggestion
            suggestion={data?.suggestedReply}
            onAccept={(text) => {
              setMessage(text);
              setShowSuggestion(false);
            }}
            onReject={() => setShowSuggestion(false)}
          />
        )}

        {/* ChatBar */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={"chatbar-bottom"}
            layout
            layoutId="support-chatbar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
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

