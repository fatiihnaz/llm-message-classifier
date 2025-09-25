"use client";

import { AlertCircle, UserX, WifiOff, MessageSquarePlus, MessageSquareOff } from "lucide-react";

export default function SidebarStates({ isSupport, isLoading = false, error = null }) {
  const { message, Icon } = resolveError(isSupport, error);
  if (isLoading) {
    return (
      <div className="h-full overflow-y-hidden px-2 pb-4">
        <div className="space-y-2">
          {Array.from({ length: isSupport ? 6 : 3 }).map((_, index) => (
            <div key={index} className="p-3 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md shimmer" />
                  <div className="h-3 w-24 rounded shimmer" />
                </div>
                <div className="h-2 w-10 rounded shimmer" />
              </div>
              <div className="h-3 w-4/5 rounded shimmer mb-2" />
              {isSupport && 
              <div className="flex items-center gap-2">
                <div className="h-3 w-full rounded shimmer" />
              </div>}
            </div>
          ))}
        </div>

        <style jsx>{`
          .shimmer {
            position: relative;
            overflow: hidden;
            background-color: #f3f4f6; /* gray-100 */
          }
          .shimmer::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background: linear-gradient(
              90deg,
              rgba(243, 244, 246, 0) 0%,
              rgba(229, 231, 235, 0.9) 50%,
              rgba(243, 244, 246, 0) 100%
            );
            animation: shimmer 1.4s infinite;
          }
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-hidden px-4 pb-4">
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <Icon className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function resolveError(isSupport, error) {
  const fallback = { message: "Bilinmeyen bir hata oluştu.", Icon: AlertCircle };
  if (!error) return fallback;

  // Kullanıcı ID gerekli
  if (/UserId required/i.test(error)) {
    return { message: "Kullanıcı giriş yapmamış (userId required).", Icon: UserX };
  }

  // Ticket bulunamadı hatası
  if (/No tickets found/i.test(error)) {
    return isSupport ? { message: "Yeni bir istek yok.", Icon: MessageSquareOff } : { message: "Yeni bir talep oluşturun.", Icon: MessageSquarePlus };
  }

  // Backend bağlantı sorunu (fetch/network error)
  if (/NetworkError|TypeError: Failed to fetch/i.test(error)) {
    return { message: "Sunucuya bağlanılamıyor.", Icon: WifiOff };
  }

  // Bilinmeyen hata
  return fallback;
}
