// app/(public)/page.tsx
import { Suspense } from "react";
import HeroSection from "@/components/public/home/HeroSection";
import ServiceSection from "@/components/public/home/ServiceSection";
import StatsSection from "@/components/public/home/StatsSection";
import RecentTrainings from "@/components/public/home/RecentTrainings";
import TrainingSkeleton from "@/components/public/home/TrainingSkeleton";
import ContactCTA from "@/components/public/home/ContactCTA";
import ClientExperience from "@/components/public/home/ClientExperience";
import LearningActivities from "@/components/public/home/LearningActivities";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero: Filosofi & CTA Utama */}
      <HeroSection />

      {/* Bagian Clien Experience */}
      <ClientExperience />

      {/* 2. Stats: Pengalaman Kerja & Kredibilitas */}
      <StatsSection />

      {/* 3. Services: Deskripsi Layanan Teknik */}
      <ServiceSection />

      <LearningActivities />

      {/* 4. Trainings: Daftar Pelatihan (Streaming Section) */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16 space-y-4">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em]">
              Upcoming Classes
            </h2>
            <p className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Jadwal Pelatihan Terbaru
            </p>
            <p className="text-slate-500 font-medium">
              Ambil sertifikasi internasional dan tingkatkan kualifikasi teknis
              Anda di bidang inspeksi baja.
            </p>
          </div>

          {/* Bagian ini akan loading secara mandiri */}
          <Suspense fallback={<TrainingSkeleton />}>
            <RecentTrainings />
          </Suspense>
        </div>
      </section>

      {/* 5. Contact: Lokasi & WhatsApp Center */}
      <ContactCTA />
    </div>
  );
}
