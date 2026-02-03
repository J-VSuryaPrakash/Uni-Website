import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as menuApi from "../api/menu.api";

export const useMenus = () => {
	const qc = useQueryClient();

	const menusQuery = useQuery({
		queryKey: ["menus"],
		queryFn: menuApi.getMenus,
	});

	const create = useMutation({
		mutationFn: menuApi.createMenu,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["menus"] }),
	});

	const update = useMutation({
		mutationFn: ({ id, data }: any) => menuApi.updateMenu(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["menus"] }),
	});

	const remove = useMutation({
		mutationFn: menuApi.deleteMenu,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["menus"] }),
	});

	const reorder = useMutation({
		mutationFn: menuApi.reorderMenus,
		onMutate: async (newOrder) => {
			// Cancel any outgoing refetches
			await qc.cancelQueries({ queryKey: ["menus"] });

			// Get the previous data
			const previousMenus = qc.getQueryData<any[]>(["menus"]);

			// Optimistically update to the new value
			if (previousMenus) {
				qc.setQueryData(["menus"], newOrder);
			}

			return { previousMenus };
		},
		onError: (err, newOrder, context: any) => {
			// Rollback on error
			if (context?.previousMenus) {
				qc.setQueryData(["menus"], context.previousMenus);
			}
		},
		onSuccess: () => {
			// Refetch to ensure sync with server
			qc.invalidateQueries({ queryKey: ["menus"] });
		},
	});

	return { ...menusQuery, create, update, remove, reorder };
};
