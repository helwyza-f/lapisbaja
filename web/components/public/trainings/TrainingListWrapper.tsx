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

  try {
    const res = await api.get(`/trainings?page=${page}&limit=${limit}`);
    trainings = res.data?.data || [];
  } catch (error) {
    console.error("Gagal ambil data pelatihan:", error);
  }

  return <TrainingList initialData={trainings} currentPage={parseInt(page)} />;
}
