import { useQuery } from "@tanstack/react-query";
import { getNotificationsByCategory, getAllActiveNotifications } from "../api/notifications.api";

export function useNotifications(category) {
  return useQuery({
    queryKey: ["notifications", category],
    queryFn: () =>
      category === "all"
        ? getAllActiveNotifications()
        : getNotificationsByCategory(category),
    enabled: !!category,
    staleTime: 2 * 60 * 1000,
  });
}
