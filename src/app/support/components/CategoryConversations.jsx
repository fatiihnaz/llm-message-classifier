"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { fetchSupportRequests } from "../../../hooks/useHttp";

export default function CategoryConversations({ selectedCategory, onSelectChat }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['support.requests', selectedCategory?.routingKey],
    queryFn: ({ signal }) => fetchSupportRequests({ signal, routingKey: selectedCategory?.routingKey }),
    enabled: Boolean(selectedCategory?.routingKey)
  });

  const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  };

  const messageList = Array.isArray(data) ? data : [];
  const total = messageList.length;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <selectedCategory.icon className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedCategory.title || "Sohbetler"}</h2>
            <p className="text-sm text-gray-500">Bu kategoriye ait sohbetler</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">Toplam {total}</div>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 divide-y">
        {total === 0 ? (
          <div className="p-6 text-sm text-gray-500">Henüz sohbet yok.</div>
        ) : (
          data.map((conversation) => {

            const time = formatTime(conversation.createdAt);

            return (
              <button
                key={conversation.messageId}
                onClick={() => onSelectChat?.(conversation.messageId)}
                className={`w-full text-left p-4 flex flex-col gap-1 hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center bg-gray-100`}>
                      <MessageSquare className={`w-3.5 h-3.5 text-gray-700`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{conversation.userId}</span>
                  </div>
                  <span className="text-xs text-gray-500">{time}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {conversation.category} • {conversation.text}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${conversation.urgency === 3
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                    >
                      {conversation.urgency === 3 ? "Öncelik" : "Normal"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

