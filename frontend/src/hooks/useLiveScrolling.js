import { useQuery } from "@tanstack/react-query";
import { getLiveScrollingNotifications } from "../api/notifications.api";

export function useLiveScrolling() {
  return useQuery({
    queryKey: ["live-scrolling"],
    queryFn: getLiveScrollingNotifications,
    staleTime: 60 * 1000, // 1 minute - refresh more often for live data
    refetchInterval: 5 * 60 * 1000, // auto-refresh every 5 minutes
  });
}
