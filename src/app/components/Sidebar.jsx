"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquarePlus } from "lucide-react";
import SidebarCategorySelector from "../support/components/SidebarCategorySelector";
import { SidebarCustomerConversations, SidebarSupportConversations } from "./SidebarConversations";
import SidebarStates from "./SidebarStates";

export default function Sidebar({
  user,
  isLoading = false,
  error = null,
  conversations = [],
  categories = [],
  activeChatId = null,
  selectedCategory = null,
  onSelectChat,
  onSelectDashboard,
  onSelectCategory,
}) {

  const isSupport = usePathname().includes("/support");
  const ConversationComponent = isSupport ? SidebarSupportConversations : SidebarCustomerConversations;

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0">
      {/* Kullanıcı Bilgisi */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
            {user.username?.[0]?.toUpperCase() || "D"}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">{user.username}</div>
          <div className="text-xs text-gray-500">{isSupport ? "Destek Ekibi" : "Müşteri"}</div>
        </div>
      </div>

      {/* Dashboard butonu */}
      <div className="p-3 border-b border-gray-200">
        <button onClick={isSupport ? onSelectDashboard : undefined} className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeChatId === null ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          {isSupport ? (
            <>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </>
          ) : <>
            <MessageSquarePlus className="w-4 h-4" />
            <span>Yeni Sohbet</span>
          </>}
        </button>
      </div>

      {/* Sohbet listesi başlık */}
      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">{isSupport ? "Son Talepler" : "Geçmiş Talepler"}</div>

      {/* Sohbet listesi */}
      <div className="flex-1 overflow-y-auto px-2 pb-4" style={{ scrollbarWidth: "thin" }}>
        {(isLoading || error) ? (
          <SidebarStates isSupport={isSupport} isLoading={isLoading} error={error} />
        ) : (
          <ConversationComponent conversations={conversations} activeChatId={activeChatId} onSelectChat={onSelectChat} />
        )}
      </div>

      {/* Kategori seçici */}
      {isSupport && selectedCategory !== null && (
        <div className="border-t border-gray-200 p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Kategori</div>
          <SidebarCategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>
      )}
    </aside>
  );
}
