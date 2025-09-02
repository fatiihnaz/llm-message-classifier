"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MessageList({ messages, messagesEndRef }) {
  const scrollRef = useRef(null);
  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 transparent' }}
      ref={scrollRef}
    >
      {messages.length === 0 ? (
        <div className="flex-1 flex items-end pb-10 justify-center min-h-[30vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Bugün size nasıl yardım edebiliriz?
              </h3>
              <p className="text-gray-600 text-sm">
                Sorularınızı yazabilir, destek ekibimizle iletişime geçebilirsiniz.
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col justify-end min-h-full px-3 sm:px-4 py-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id ?? index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`mb-2 flex ${msg.isFromUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`"max-w-[78%] sm:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border
                    ${msg.isFromUser ? "bg-gray-900 text-white border-gray-800 rounded-br-md" : "bg-white text-gray-800 border-gray-200 rounded-bl-md"}`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
