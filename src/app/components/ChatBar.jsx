"use client";

import { useRef, useEffect } from "react";
import { Mic, Paperclip, Loader2, X, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBar({ message, setMessage, isPending, isError, error, canSend, onSend }) {
  const textareaRef = useRef(null);


  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, 72);
      textarea.style.height = scrollHeight + 'px';
    }
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend(message);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
        <div className="relative">
          {/* Hata mesajı */}
          <AnimatePresence>
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute mb-3 px-3 py-1 bottom-14 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 w-fit"
              >
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium">Error | <span className="text-xs -mt-0.5 text-red-600">{error || "Bir hata oluştu"}</span></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Yazı yazma kısmı */}
          <div className="flex items-center space-x-3 bg-gray-50 rounded-4xl border border-gray-200 p-1">
            <button className="p-3 text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip size={18} />
            </button>

            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => { setMessage(e.target.value); }}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Herhangi bir şey sor"
                className="w-full resize-none border-none outline-none mt-1 text-gray-800 placeholder-gray-500 text-base overflow-y-auto min-h-[24px] max-h-[72px]"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E0 transparent'
                }}
              />
            </div>

            <div className="flex items-center mx-1">
              <motion.button
                onClick={() => { if (canSend && !isPending) onSend(); }}
                disabled={!canSend || isPending}
                className={`p-3 rounded-full transition-all duration-300 ${isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : isError
                    ? "bg-red-500 hover:bg-red-600"
                    : canSend
                    ? "bg-gray-800 hover:bg-gray-700"
                    : ""
                  } text-white`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPending ? "loading" : isError ? "error" : canSend ? "ready" : "idle"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isError ? (
                      <X size={18} />
                    ) : canSend ? (
                      <ChevronUp size={18} />
                    ) : (
                      <Mic size={18} className="text-gray-500" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}