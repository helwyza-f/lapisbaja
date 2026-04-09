// components/public/trainings/TrainingListWrapper.tsx
import { api } from "@/lib/api";
import TrainingList from "./TrainingList";

export default async function TrainingListWrapper({
  page,
  limit,
}: {
  page: string;
  limit: string;
}) {
  let trainings = [];
  let paginationMeta = null;

  try {
    const res = await api.get(`/trainings?page=${page}&limit=${limit}`);

    // SYNC WITH NEW BACKEND: Ambil items dan meta
    const { items, meta } = res.data?.data || {};

    trainings = items || [];
    paginationMeta = meta || null;
  } catch (error) {
    console.error("INDUSTRIAL_ERROR: Failed to fetch catalog data:", error);
  }

  return (
    <TrainingList
      initialData={trainings}
      meta={paginationMeta}
      currentPage={parseInt(page)}
    />
  );
}
