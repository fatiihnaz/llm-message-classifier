"use client";

import { Check, X } from "lucide-react";

export default function AISuggestion({
  suggestion,
  onAccept,
  onReject
}) {
  if (!suggestion) return null;

  return (
    <div className="w-full sm:w-[640px] md:w-[720px] lg:w-[768px] mx-auto mb-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-end justify-between gap-4">
        {/* Sol taraf: başlık + metin */}
        <div>
          <div className="text-xs font-medium text-gray-600 mb-2">
            AI Mesaj Önerisi
          </div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {suggestion}
          </div>
        </div>

        {/* Sağ taraf: butonlar (yan yana, sadece ikon) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAccept(suggestion)}
            className="px-2 py-3 rounded-full bg-green-100 border-2 border-green-200 text-green-700 hover:bg-green-200 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onReject}
            className="px-2 py-3 rounded-full bg-red-100 border-2 border-red-200 text-red-700 hover:bg-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
