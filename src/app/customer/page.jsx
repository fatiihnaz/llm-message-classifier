"use client";

import Header from "./components/Header";
import CustomerChat from "./components/CustomerChat";

export default function CustomerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-full max-h-[calc(100vh-8rem)]">
          <CustomerChat />
        </div>
      </main>
    </div>
  );
}
