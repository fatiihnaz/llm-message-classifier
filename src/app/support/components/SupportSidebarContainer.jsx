"use client";
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/Sidebar';
import { fetchSupportRequests } from '../../../hooks/useHttp';

export default function SupportSidebarContainer({
  user,
  categories,
  selectedCategory,
  activeChatId,
  onSelectChat,
  onSelectDashboard,
  onSelectCategory,
}) {
  const { data, isLoading, isError , error} = useQuery({
    queryKey: ['support.requests', selectedCategory?.routingKey],
    queryFn: ({ signal }) => fetchSupportRequests({ signal, routingKey: selectedCategory?.routingKey }),
    enabled: Boolean(selectedCategory?.routingKey),
    refetchInterval: 10000,
  });

  return (
    <Sidebar
      user={user}
      isLoading={isLoading}
      error={isError ? error : null}
      conversations={data || []}
      activeChatId={activeChatId}
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectChat={onSelectChat}
      onSelectDashboard={onSelectDashboard}
      onSelectCategory={onSelectCategory}
    />
  );
}
