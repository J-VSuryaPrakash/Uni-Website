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
		onMutate: async (newOrder: { id: number; position: number }[]) => {
			// Cancel any outgoing refetches
			await qc.cancelQueries({ queryKey: ["menus"] });

			// Get the previous data
			const previousMenus = qc.getQueryData<any[]>(["menus"]);

			// Optimistically update to the new value
			if (previousMenus) {
				// Create a map of new positions
				const positionMap = new Map(
					newOrder.map((item) => [item.id, item.position]),
				);

				// Update the menus with new positions
				const updatedMenus = previousMenus
					.map((menu) => ({
						...menu,
						position: positionMap.get(menu.id) ?? menu.position,
					}))
					.sort((a, b) => a.position - b.position);

				qc.setQueryData(["menus"], updatedMenus);
			}

			return { previousMenus };
		},
		onError: (context: any) => {
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
