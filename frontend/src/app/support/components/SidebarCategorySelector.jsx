"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SidebarCategorySelector({ categories = [], selectedCategory = null, onSelectCategory }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-3 py-2.5"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            {selectedCategory?.icon ? <selectedCategory.icon className="w-5 h-5 text-gray-700" /> : null}
          </div>
          <div className="min-w-0 text-left">
            <div className="text-sm font-medium text-gray-900 truncate">{selectedCategory?.title}</div>
            <div className="text-xs text-gray-500 truncate">Destek kategorisi</div>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 bottom-full mb-2 z-20 rounded-xl border border-gray-200 bg-white shadow-lg p-1">
          {categories.filter(category => category.id !== selectedCategory).map((category) => (
            <button key={category.id}
              onClick={() => { onSelectCategory?.(category.id); setOpen(false); }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${selectedCategory === category.id ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${selectedCategory === category.id ? "bg-gray-900" : "bg-gray-100"}`}>
                  <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? "text-white" : "text-gray-700"}`}/>
                </div>
                <div className="min-w-0 text-left">
                  <div className={`text-sm font-medium truncate ${selectedCategory === category.id ? "text-gray-900" : "text-gray-800"}`}>
                    {category.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">Kategori öğesi</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}