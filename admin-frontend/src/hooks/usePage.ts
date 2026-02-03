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
          
            //OPTIMISTIC UPDATE
            onMutate: async (newOrder) => {
              await qc.cancelQueries({ queryKey: ["pages"] });
          
              const previous = qc.getQueryData<any[]>(["pages"]);
          
              qc.setQueryData(["pages"], (old: any[] = []) => {
                const map = new Map(newOrder.map((p: any) => [p.id, p.position]));
          
                return old.map((p) =>
                  map.has(p.id)
                    ? { ...p, position: map.get(p.id) }
                    : p
                );
              });
          
              return { previous };
            },
          
            onError: (_err, _data, context) => {
              qc.setQueryData(["pages"], context?.previous);
            },
          
            onSettled: () => {
              qc.invalidateQueries({ queryKey: ["pages"] });
            },
          })
	};
};
