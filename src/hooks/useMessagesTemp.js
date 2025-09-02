"use client";

import { useState, useEffect, useRef } from "react";

export default function useMessagesTemp() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasAnyMessage, setHasAnyMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Mesajları otomatik olarak en alta kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Kullanıcı mesajı ekle
  const addUserMessage = (messageText) => {
    if (!messageText || !messageText.trim()) return;

    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      // Aynı mesajın tekrar eklenmesini önle
      if (lastMessage && lastMessage.text === messageText && lastMessage.isFromUser) {
        return prev;
      }

      const userMessage = {
        id: Date.now(),
        text: messageText,
        isFromUser: true,
        timestamp: new Date()
      };

      return [...prev, userMessage];
    });

    // İlk mesajdan sonra hasAnyMessage'ı true yap
    if (!hasAnyMessage) {
      setHasAnyMessage(true);
    }
  };

  // Otomatik cevap ekle (bot/sistem mesajı)
  const addAutoReply = (replyText, delay = 1000) => {
    const timeoutId = setTimeout(() => {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        // Aynı otomatik cevabın tekrar eklenmesini önle
        if (lastMessage && !lastMessage.isFromUser && lastMessage.text.includes(replyText)) {
          return prev;
        }

        const autoReply = {
          id: Date.now() + Math.random(),
          text: replyText,
          isFromUser: false,
          timestamp: new Date()
        };
        
        return [...prev, autoReply];
      });
    }, Math.random() * 1000 + delay);

    return () => clearTimeout(timeoutId);
  };

  // Mesaj gönderildiğinde çağrılacak fonksiyon
  const handleSentMessage = (messageText) => {
    addUserMessage(messageText);
    
    // Otomatik cevap ekle
    const cleanup = addAutoReply("Canlı desteğe bağlıyorum, lütfen bekleyiniz...", 1000);
    
    return cleanup;
  };

  // Mesajları temizle
  const clearMessages = () => {
    setMessages([]);
    setHasAnyMessage(false);
  };

  return {
    messages,
    loading,
    hasAnyMessage,
    messagesEndRef,
    setLoading,
    addUserMessage,
    addAutoReply,
    handleSentMessage,
    clearMessages,
    scrollToBottom
  };
}