import { useQuery } from "@tanstack/react-query";
import { getPageBySlug } from "../api/pages.api";

export function usePage(slug) {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: () => getPageBySlug(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
