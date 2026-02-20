import { useQuery } from "@tanstack/react-query";
import { getActiveEvents } from "../api/events.api";

export function useEvents() {
  return useQuery({
    queryKey: ["events-active"],
    queryFn: getActiveEvents,
    staleTime: 2 * 60 * 1000,
  });
}
