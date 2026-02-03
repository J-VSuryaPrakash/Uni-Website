import type { Page } from "../types/Page.types";

export function buildTree(pages: Page[]) {
	const map = new Map<number, Page>();

	// clone + initialize
	pages.forEach((p) => map.set(p.id, { ...p, children: [] }));

	const roots: Page[] = [];

	map.forEach((page) => {
		if (page.parentId) {
			map.get(page.parentId)?.children?.push(page);
		} else {
			roots.push(page);
		}
	});

	// 🔥 SORT EVERY LEVEL BY POSITION
	const sortRecursive = (nodes: Page[]) => {
		nodes.sort((a, b) => a.position - b.position);
		nodes.forEach((n) => {
			if (n.children?.length) sortRecursive(n.children);
		});
	};

	sortRecursive(roots);

	return roots;
}
