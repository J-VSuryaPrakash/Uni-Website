import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notifications.api";

export function useNotifications({ page, category, search }) {
  return useQuery({
    queryKey: ["notifications", { page, category, search }],
    queryFn: () =>
      getNotifications({
        page,
        category,
        search,
      }),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });
}