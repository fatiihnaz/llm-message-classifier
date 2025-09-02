"use client";

import CustomerSidebarContainer from "./components/CustomerSidebarContainer";
import CustomerChat from "./components/CustomerChat";
import { useState, useEffect } from "react";

export default function CustomerPage() {

  const [user, setUser] = useState({
      username: "",
      userId: "",
    });
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("username") || "Kullanıcı";
        setUser({
          username: u,
          userId: u, // şimdilik username = userId
        });
      }
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
          <CustomerSidebarContainer
            user={user}
            activeChatId={null}
            onSelectChat={undefined}
          />
    
          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <CustomerChat />
          </div>
        </div>
  );
}
