import { useQuery } from "@tanstack/react-query";
import { getMenuTree } from "../api/menu.api";

// Transform backend menu tree to frontend navigation format
function transformMenuTree(menus) {
  if (!menus) return [];

  return menus.map((menu) => ({
    label: menu.name,
    path: `/${menu.slug}`,
    menuSlug: menu.slug,
    children: transformPages(menu.pages || []),
  }));
}

function transformPages(pages) {
  if (!pages || pages.length === 0) return undefined;

  return pages.map((page) => ({
    label: page.title,
    path: `/${page.slug}`,
    children: transformPages(page.children),
  }));
}

export function useMenuTree() {
  const query = useQuery({
    queryKey: ["menu-tree"],
    queryFn: getMenuTree,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: transformMenuTree,
  });

  return query;
}

// Get raw menu tree without transformation (for sidebar matching)
export function useRawMenuTree() {
  return useQuery({
    queryKey: ["menu-tree"],
    queryFn: getMenuTree,
    staleTime: 5 * 60 * 1000,
  });
}
