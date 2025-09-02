import { MessageSquare } from "lucide-react";

export default function SidebarSupportRequests({ conversations = [], activeChatId, onSelectChat }) {
  const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {conversations.map((conversation) => {
        const isActive = activeChatId === conversation.messageId;
        const time = formatTime(conversation.createdAt);
        return (
          <button
            key={conversation.messageId}
            onClick={() => conversation.messageId && onSelectChat?.(conversation.messageId)}
            className={`w-full text-left p-3 rounded-lg border transition-colors mb-2 flex flex-col gap-1 ${isActive ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isActive ? "bg-gray-800" : "bg-gray-100"}`}>
                  <MessageSquare className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-700"}`} />
                </div>
                <span className="text-sm font-medium">{conversation.userId}</span>
              </div>
              <span className={`text-xs ${isActive ? "text-gray-300" : "text-gray-500"}`}>{time}</span>
            </div>
            <div className="text-xs text-gray-500 truncate">
              {conversation.category}{conversation.category && conversation.text ? " • " : ""}{conversation.text}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${conversation.urgency === 3
                      ? isActive
                        ? "bg-red-500/20 text-red-100 border border-red-400/30"
                        : "bg-red-50 text-red-700 border border-red-200"
                      : isActive
                        ? "bg-gray-700 text-gray-100 border border-gray-600"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                >
                  {conversation.urgency === 3 ? "Öncelik" : "Normal"}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </>
  );
}

