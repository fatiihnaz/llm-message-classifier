"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postMessage } from "@/hooks/useHttp";
import ChatBar from "../../components/ChatBar";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import Conversation from "@/app/components/Conversation";

export default function CustomerChat({ activeChatId, setActiveChatId }) {
  const [message, setMessage] = useState("");
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";

  const { mutateAsync: sendMessage, isPending, isError, error } = useMutation({
    mutationFn: async ({ text, userId, signal }) => {
      const body = { Text: text, UserID: userId };
      return postMessage({ signal, body });
    },
    onSuccess: (response) => {
      if (response?.messageId) setActiveChatId(response.messageId);
    },
  });

  const canSend = message.trim().length > 0 && !isPending;

  async function handleSendMessage() {
    if (!canSend) return;
    try {
      await sendMessage({ text: message, userId: username });
      setMessage("");
    } catch { }
  }

  return (
    <LayoutGroup>
      <div className="min-h-dvh flex flex-col">
        {activeChatId ? (
          <Conversation conversationId={activeChatId} className={"sm:px-20 md:px-30 px-10 flex-1"} />
        ) : (
          <div className="flex-1 flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-3"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Bugün size nasıl yardım edebiliriz?
              </h3>
              <p className="text-gray-600 text-sm">
                Sorularınızı yazabilir, destek ekibimizle iletişime geçebilirsiniz.
              </p>

              <motion.div
                layoutId="chatbar"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className={"w-full sm:w-[640px] md:w-[720px] lg:w-[768px] mx-auto mt-6"}
              >
                {!activeChatId && (
                  <ChatBar
                    message={message}
                    setMessage={setMessage}
                    isPending={isPending}
                    isError={isError}
                    canSend={canSend}
                    error={error?.message || "Bir hata oluştu."}
                    onSend={handleSendMessage}
                  />
                )}
              </motion.div>
            </motion.div>
          </div>
        )}

        <div className="sticky bottom-0 left-0 right-0 px-4 py-3">
          <AnimatePresence mode="wait" initial={false}>
            {activeChatId && (
              <motion.div
                key="bottom-chatbar"
                layoutId="chatbar"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={"w-full sm:w-[640px] md:w-[720px] lg:w-[768px] mx-auto"}
              >
                <ChatBar
                  message={message}
                  setMessage={setMessage}
                  isPending={isPending}
                  isError={isError}
                  canSend={canSend}
                  error={error?.message || "Bir hata oluştu."}
                  onSend={handleSendMessage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LayoutGroup>
  );
}
