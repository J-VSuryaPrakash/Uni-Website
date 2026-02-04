import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as pageApi from "../api/pages.api";

export const usePages = () => {
	const qc = useQueryClient();

	const query = useQuery({
		queryKey: ["pages"],
		queryFn: pageApi.getPages,
	});

	const invalidate = () => qc.invalidateQueries({ queryKey: ["pages"] });

	return {
		...query,
		create: useMutation({
			mutationFn: pageApi.createPage,
			onSuccess: invalidate,
		}),
		update: useMutation({
			mutationFn: ({ id, data }: any) => pageApi.updatePage(id, data),
			onSuccess: invalidate,
		}),
		remove: useMutation({
			mutationFn: pageApi.deletePage,
			onSuccess: invalidate,
		}),
		move: useMutation({
			mutationFn: ({ id, data }: any) => pageApi.movePage(id, data),
			onSuccess: invalidate,
		}),
		 reorder: useMutation({
				mutationFn: pageApi.reorderPages,
				onMutate: async (newOrder: { id: number; position: number }[]) => {
					// Cancel any outgoing refetches
					await qc.cancelQueries({ queryKey: ["pages"] });
		
					// Get the previous data
					const previousPages = qc.getQueryData<any[]>(["pages"]);
		
					// Optimistically update to the new value
					if (previousPages) {
						// Create a map of new positions
						const positionMap = new Map(
							newOrder.map((item) => [item.id, item.position]),
						);
		
						// Update the menus with new positions
						const updatedPages = previousPages
							.map((page) => ({
								...page,
								position: positionMap.get(page.id) ?? page.position,
							}))
							.sort((a, b) => a.position - b.position);
		
						qc.setQueryData(["pages"], updatedPages);
					}
		
					return { previousPages };
				},
				onError: (context: any) => {
					// Rollback on error
					if (context?.previousPages) {
						qc.setQueryData(["pages"], context.previousPages);
					}
				},
				onSuccess: () => {
					// Refetch to ensure sync with server
					qc.invalidateQueries({ queryKey: ["pages"] });
				},
			})
	};
};
