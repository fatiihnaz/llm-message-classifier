"use client";

import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";
import { fetchUserMessages } from "../../../hooks/useHttp";

export default function CustomerSidebarContainer({ user, activeChatId, onSelectChat, onSelectNewChat }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customer.messages', user.userId],
        queryFn: ({ signal }) => fetchUserMessages({ signal, userId: user.userId }),
        enabled: Boolean(user.userId),
        retry: (failureCount, error) => { if (error.message === "No messages found") return false; return failureCount < 2; },
        refetchInterval: 10000,
    });

    return (
        <Sidebar
            user={user}
            isLoading={isLoading}
            error={isError ? error : null}
            conversations={isLoading || isError ? [] : data}
            activeChatId={activeChatId}
            onSelectChat={onSelectChat}
            onSelectNewChat={onSelectNewChat}
        />
    )

}