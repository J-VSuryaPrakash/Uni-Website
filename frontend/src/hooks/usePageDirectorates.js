import { useQuery } from "@tanstack/react-query";
import { getDirectoratesByPage } from "../api/directorates.api";

export function usePageDirectorates(pageId) {
    return useQuery({
        queryKey: ["page-directorates", pageId],
        queryFn: () => getDirectoratesByPage(pageId),
        enabled: !!pageId,
        staleTime: 5 * 60 * 1000,
    });
}
