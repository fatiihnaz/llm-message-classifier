"use client";
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/Sidebar';
import { fetchSupportRequests } from '../../../hooks/useHttp';

export default function SupportSidebarContainer({
  categories,
  selectedCategory,
  activeChatId,
  onSelectChat,
  onSelectDashboard,
  onSelectCategory,
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['support.requests', selectedCategory?.routingKey],
    queryFn: ({ signal }) => fetchSupportRequests({ signal, routingKey: selectedCategory?.routingKey }),
    enabled: Boolean(selectedCategory?.routingKey),
  });

  return (
    <Sidebar
      conversations={isLoading || isError ? [] : data}
      activeChatId={activeChatId}
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectChat={onSelectChat}
      onSelectDashboard={onSelectDashboard}
      onSelectCategory={onSelectCategory}
    />
  );
}
