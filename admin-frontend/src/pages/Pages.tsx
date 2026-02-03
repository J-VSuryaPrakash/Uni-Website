import { usePages } from "../hooks/usePage";
import { buildTree } from "../utils/builderTree";
import PageTreeItem from "./PageTreeItem";
import { Button } from "@/components/ui/button";

export default function Pages() {
	const { data, create, update, remove, reorder } = usePages();

    const isLoading = !data && !create.isPending && !update.isPending && !remove.isPending;

    if (isLoading) return <div>Loading...</div>;

	const tree = buildTree(data ?? []);

	return (
		<div className="space-y-6">
			<div className="flex justify-between">
				<h1 className="text-xl font-semibold">Pages</h1>

				<Button
					onClick={() =>
						create.mutate({
							title: "New Page",
							slug: "new-page",
							position: 0,
						})
					}
				>
					Add Page
				</Button>
			</div>

			<div>
				{tree.map((page) => (
					<PageTreeItem
						key={page.id}
						page={page}
						onDelete={(id) => remove.mutate(id)}
						onUpdate={(id, data) => update.mutate({ id, data })}
						onReorder={(payload) => reorder.mutate(payload)}
					/>
				))}
			</div>
		</div>
	);
}
