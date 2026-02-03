import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { Page } from "../types/Page.types";
import SectionList from "../components/SectionList";

export default function PageEditor() {
	const { id } = useParams();

	const { data, isLoading } = useQuery({
		queryKey: ["page", id],
		queryFn: async () => {
			const res = await api.get(`/admin/pages/${id}`);
			return res.data.data as Page;
		},
	});

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<h1 className="text-2xl font-semibold">{data?.title}</h1>

			<SectionList sections={data?.sections ?? []} pageId={Number(id)} />
		</div>
	);
}
