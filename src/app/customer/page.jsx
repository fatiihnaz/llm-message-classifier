"use client";

import CustomerSidebarContainer from "./components/CustomerSidebarContainer";
import CustomerChat from "./components/CustomerChat";
import { useState, useEffect } from "react";

export default function CustomerPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [user, setUser] = useState({
      username: "",
      userId: "",
    });
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("username") || "Kullanıcı";
        setUser({
          username: u,
          userId: u,
        });
      }
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
          <CustomerSidebarContainer
            user={user}
            activeChatId={activeChatId}
            onSelectNewChat={() => {setActiveChatId(null);}}
            onSelectChat={(id) => {setActiveChatId(id);}}
          />
    
          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <CustomerChat activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
          </div>
        </div>
  );
}
