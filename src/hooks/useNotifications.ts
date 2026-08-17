import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type{ NotificationsResponse } from "@/types/Notification";
import api from "@/lib/api";


const fetchNotifications = async (): Promise<NotificationsResponse> => {
  const { data } = await api.get("/notifications");
  return data;
};


const markAsReadApi = async (id: number): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};


const markAllAsReadApi = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: true,
  });

  const notifications = query.data?.data ?? [];
  const unreadCount = notifications.filter((n) => n.read_at === null).length;

  
  const markAsReadMutation = useMutation({
    mutationFn: markAsReadApi,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData<NotificationsResponse>(["notifications"]);

      if (previousData) {
        queryClient.setQueryData<NotificationsResponse>(["notifications"], {
          ...previousData,
          data: previousData.data.map((item) =>
            item.id === id ? { ...item, read_at: new Date().toISOString() } : item
          ),
        });
      }
      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsReadApi,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData<NotificationsResponse>(["notifications"]);

      if (previousData) {
        queryClient.setQueryData<NotificationsResponse>(["notifications"], {
          ...previousData,
          data: previousData.data.map((item) => ({
            ...item,
            read_at: item.read_at ?? new Date().toISOString(),
          })),
        });
      }
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};