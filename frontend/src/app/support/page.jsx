"use client";

import { useState, useEffect } from "react";
import { Headphones, Users, MessageSquare, BarChart3, Smile, CreditCard, Truck, MapPin } from "lucide-react";

import SupportChat from "./components/SupportChat";
import SupportPanel from "./components/SupportPanel";
import SupportSidebarContainer from "./components/SupportSidebarContainer";

export default function SupportPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [view, setView] = useState("dashboard"); // dashboard | category | conversation

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

  // Dashboard landing (AI Telemetry)
  const exerciseData = [
    { day: "Pazartesi", current: 75, normal: 65 },
    { day: "Salı", current: 45, normal: 68 },
    { day: "Çarşamba", current: 95, normal: 72 },
    { day: "Perşembe", current: 85, normal: 75 },
    { day: "Cuma", current: 90, normal: 70 },
    { day: "Cumartesi", current: 80, normal: 73 },
    { day: "Pazar", current: 85, normal: 78 },
  ];

   const appPerfData = [
    { day: "Pazartesi", current: 120, normal: 140 },
    { day: "Salı", current: 135, normal: 138 },
    { day: "Çarşamba", current: 110, normal: 142 },
    { day: "Perşembe", current: 150, normal: 145 },
    { day: "Cuma", current: 130, normal: 140 },
    { day: "Cumartesi", current: 160, normal: 150 },
    { day: "Pazar", current: 140, normal: 148 },
  ];

  const categories = [
    {
      id: "support.satisfaction",
      title: "Genel Memnuniyet",
      routingKey: "support.satisfaction",
      icon: Smile,
    },
    {
      id: "support.payment",
      title: "Ödeme Sorunları",
      routingKey: "support.payment",
      icon: CreditCard,
    },
    {
      id: "cargo.management",
      title: "Kargo Yönetimi",
      routingKey: "support.cargo.management",
      icon: Truck,
    },
    {
      id: "cargo.tracking",
      title: "Kargo Takip",
      routingKey: "support.cargo.tracking",
      icon: MapPin,
    },
  ];

  const quickStats = [
    { title: "Aktif Kullanıcılar", value: "1,247", icon: Users, change: "+12%", trend: "up" },
    { title: "Günlük İşlemler", value: "3,456", icon: MessageSquare, change: "+8%", trend: "up" },
    { title: "Sistem Uptime", value: "99.9%", icon: BarChart3, change: "+0.1%", trend: "up" },
    { title: "Ortalama Yanıt", value: "1.2s", icon: Headphones, change: "-0.3s", trend: "up" },
  ];

  const handleGoToCategory = (id) => {
    setSelectedCategoryId(id);
    setActiveChatId(null);
    setView("category");
  };

  const selectedCategory = selectedCategoryId ? categories.find(c => c.id === selectedCategoryId) || null : null;

  return (
    <div className="min-h-screen bg-gray-50/20 flex">
      <SupportSidebarContainer
        user={user}
        activeChatId={activeChatId}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectChat={(id) => {
          setActiveChatId(id);
        }}
        onSelectDashboard={() => {
          setActiveChatId(null);
          setView("dashboard");
        }}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
        }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeChatId ? (
          <SupportPanel
            view={view}
            categories={categories}
            selectedCategory={selectedCategory}
            setActiveChatId={setActiveChatId}
            handleGoToCategory={handleGoToCategory}
            quickStats={quickStats}
            exerciseData={exerciseData}
            appPerfData={appPerfData}
          />
        ) : (
          <div className="flex-1 min-h-0 px-4 sm:px-6 lg:px-8 py-6">
            <div className="h-full max-h-[calc(100vh-8rem)]">
              <SupportChat conversation={activeChatId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
