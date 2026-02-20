import { useQuery } from "@tanstack/react-query";
import { getNotificationsByCategory } from "../api/notifications.api";

export function useNotifications(category) {
  return useQuery({
    queryKey: ["notifications", category],
    queryFn: () => getNotificationsByCategory(category),
    enabled: !!category,
    staleTime: 2 * 60 * 1000,
  });
}
