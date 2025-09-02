import { MessageSquare } from "lucide-react";

const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}


export function SidebarSupportConversations({ conversations = [], activeChatId, onSelectChat }) {

    const getInitial = (name) => {
        if (!name || typeof name !== "string") return "?";
        return name.trim().charAt(0).toUpperCase();
    };

    const urgencyLabel = (urgency) => {
        const u = Number(urgency);
        if (u === 1) return "Düşük Öncelik";
        if (u === 2) return "Orta Öncelik";
        if (u === 3) return "Yüksek Öncelik";
        return "";
    };

    const urgencyClasses = (urgency, isActive) => {
        const u = Number(urgency);
        if (u === 3) return isActive ? "bg-red-500/20 text-red-100 border border-red-400/30" : "bg-red-50 text-red-700 border border-red-200";
        if (u === 2) return isActive ? "bg-amber-500/20 text-amber-100 border border-amber-400/30" : "bg-amber-50 text-amber-700 border border-amber-200";
        if (u === 1) return isActive ? "bg-green-500/20 text-gray-100 border border-gray-400/30" : "bg-gray-50 text-gray-700 border border-gray-200";
        return isActive ? "bg-gray-700 text-gray-100 border border-gray-600" : "bg-gray-100 text-gray-700 border border-gray-200";
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
                        className={`w-full text-left p-3 rounded-lg border transition-colors mb-2 flex flex-col gap-1 ${isActive ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isActive ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"}`}>
                                    <span className="text-xs font-semibold">
                                        {getInitial(conversation.userId)}
                                    </span>
                                </div>
                                <span className="text-sm font-medium">{conversation.userId}</span>
                            </div>
                            <span className={`text-xs ${isActive ? "text-gray-300" : "text-gray-500"}`}>{time}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {conversation.userId} : {conversation.text}
                        </div>
                        <div className={`text-[10px] w-full mt-1 py-1 rounded ${urgencyClasses(conversation.urgency, isActive)} text-center truncate`}>
                            {(conversation.category ?? "Genel")} | {urgencyLabel(conversation.urgency)}
                        </div>
                    </button>
                );
            })}
        </>
    );
}

export function SidebarCustomerConversations( { conversations = [], activeChatId, onSelectChat } ) {
    return (
        <>
            {conversations.map((conversation) => {
                const isActive = activeChatId === conversation.messageId;
                const time = formatTime(conversation.createdAt);
                return (
                    <button
                        key={conversation.messageId}
                        onClick={() => conversation.messageId && onSelectChat?.(conversation.messageId)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors mb-2 flex flex-col gap-1 ${isActive ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isActive ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"}`}>
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">{conversation.category}</span>
                            </div>
                            <span className={`text-xs ${isActive ? "text-gray-300" : "text-gray-500"}`}>{time}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {conversation.userId === conversation.userId ? "Siz" : conversation.userId} : {conversation.text}
                        </div>
                    </button>
                );
            })}
        </>
    )
}