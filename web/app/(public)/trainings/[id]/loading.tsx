// app/trainings/[id]/loading.tsx
export default function TrainingDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden">
        {/* Mockup Background Glow */}
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />

        <div className="container mx-auto px-6 relative z-30">
          <div className="max-w-4xl space-y-6">
            {/* Badge Skeleton */}
            <div className="w-32 h-6 bg-white/5 rounded-full animate-pulse" />
            {/* Title Skeleton */}
            <div className="space-y-3">
              <div className="w-full md:w-3/4 h-12 md:h-16 bg-white/10 rounded-2xl animate-pulse" />
              <div className="w-1/2 h-12 md:h-16 bg-white/10 rounded-2xl animate-pulse hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-20 -mt-10 md:-mt-16 relative z-30">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
              {/* Left Column Skeleton (Detail) */}
              <div className="xl:col-span-7 space-y-12">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                      <div className="space-y-2">
                        <div className="w-16 h-3 bg-slate-200 rounded" />
                        <div className="w-24 h-4 bg-slate-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* About Section Skeleton */}
                <div className="space-y-4">
                  <div className="w-48 h-8 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-slate-50 rounded animate-pulse" />
                    <div className="w-full h-4 bg-slate-50 rounded animate-pulse" />
                    <div className="w-3/4 h-4 bg-slate-50 rounded animate-pulse" />
                  </div>
                </div>

                {/* Syllabus Skeleton */}
                <div className="space-y-6">
                  <div className="w-56 h-8 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Skeleton (Form) */}
              <div className="xl:col-span-5">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8 animate-pulse">
                  <div className="space-y-2 text-center">
                    <div className="mx-auto w-32 h-6 bg-slate-200 rounded-lg" />
                    <div className="mx-auto w-48 h-4 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="space-y-6">
                    <div className="w-full h-12 bg-white rounded-2xl border border-slate-100" />
                    <div className="w-full h-12 bg-white rounded-2xl border border-slate-100" />
                    <div className="w-full h-12 bg-white rounded-2xl border border-slate-100" />
                    <div className="w-full h-14 bg-slate-200 rounded-full mt-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
