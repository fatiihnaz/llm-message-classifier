"use client";

import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";
import { fetchUserMessages } from "../../../hooks/useHttp";

export default function CustomerSidebarContainer({ user, activeChatId, onSelectChat }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['customer.messages', user.userId],
        queryFn: ({ signal }) => fetchUserMessages({ signal, userId: user.userId }),
        enabled: Boolean(user.userId),
    });

    return (
        <Sidebar
            user={user}
            conversations={isLoading || isError ? [] : data}
            activeChatId={activeChatId}
            onSelectChat={onSelectChat}
        />
    )

}