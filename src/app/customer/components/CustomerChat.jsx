"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postMessage, patchCargoTrackingNumber, fetchTicket } from "../../../hooks/useHttp";
import ChatBar from "../../components/ChatBar";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import Conversation from "../../components/Conversation";

export default function CustomerChat({ activeChatId, setActiveChatId }) {
  const [message, setMessage] = useState("");
  const [cargoNumber, setCargoNumber] = useState("");
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";
  const queryClient = useQueryClient();

  const { mutateAsync: sendMessage, isPending, isError, error } = useMutation({
    mutationFn: async ({ text, userId, signal }) => {
      const body = { Text: text, UserID: userId };
      return postMessage({ signal, body });
    },
    onSuccess: async (response) => {
      if (response?.messageId) setActiveChatId(response.messageId);
      await queryClient.invalidateQueries({ queryKey: ["conversation", response?.messageId] });
    },
  });

  const { mutateAsync: sendPatch, isPending: isPatchPending, isError: isPatchError, error: patchError } = useMutation({
    mutationFn: async ({ ticketId, cargoTrackingNumber, signal }) => {
      return patchCargoTrackingNumber({ signal, ticketId, cargoTrackingNumber });
    },
    onSuccess: async () => {
      setCargoNumber("");
      await queryClient.invalidateQueries({ queryKey: ["ticket", activeChatId] });
      await queryClient.invalidateQueries({ queryKey: ["conversation", activeChatId] });
    },
  });

  const { data: ticket, isFetching: isTicketFetching } = useQuery({
    queryKey: ["ticket", activeChatId],
    queryFn: () => fetchTicket({ ticketId: activeChatId }),
    enabled: !!activeChatId,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: (data) => {
      if (!data) return 4000;
      return data.cargoTrackingNumber ? false : 4000;
    },
  });

  const inPatchMode = !!activeChatId && !ticket?.cargoTrackingNumber;
  const canSend = inPatchMode ? cargoNumber.trim().length > 0 && !isPatchPending : message.trim().length > 0 && !isPending;

  async function handleSendMessage() {
    if (!canSend) return;
    try {
      if (inPatchMode) {
        await sendPatch({
          ticketId: activeChatId,
          cargoTrackingNumber: cargoNumber.trim(),
        });
      } else {
        await sendMessage({ text: message, userId: username });
        setMessage("");
      }
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
                    message={inPatchMode ? cargoNumber : message}
                    setMessage={inPatchMode ? setCargoNumber : setMessage}
                    isPending={inPatchMode ? isPatchPending || isTicketFetching : isPending}
                    isError={inPatchMode ? isPatchError : isError}
                    canSend={canSend}
                    error={(inPatchMode ? patchError?.message : error?.message) || "Bir hata oluştu."}
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
                className={"w-full sm:w-[640px] md:w-[720px] lg:w-[768px] mx-auto mb-16"}
              >
                <ChatBar
                  message={inPatchMode ? cargoNumber : message}
                  setMessage={inPatchMode ? setCargoNumber : setMessage}
                  isPending={inPatchMode ? isPatchPending || isTicketFetching : isPending}
                  isError={inPatchMode ? isPatchError : isError}
                  canSend={canSend}
                  error={(inPatchMode ? patchError?.message : error?.message) || "Bir hata oluştu."}
                  placeholder={inPatchMode ? "Kargo takip numaranızı girin." : "Herhangi bir şey sorun."}
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
