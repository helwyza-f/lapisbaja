// app/trainings/loading.tsx
export default function TrainingsLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <section className="bg-slate-950 pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center space-y-4">
          <div className="mx-auto w-40 h-6 bg-white/5 rounded-full animate-pulse" />
          <div className="mx-auto w-3/4 md:w-1/2 h-12 md:h-16 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Filter Tabs Skeleton */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-24 h-10 bg-slate-100 rounded-full animate-pulse"
              />
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[400px] rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden p-6 space-y-6"
              >
                <div className="w-full h-48 bg-slate-200 rounded-2xl animate-pulse" />
                <div className="space-y-3">
                  <div className="w-3/4 h-6 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="w-full h-4 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="w-2/3 h-4 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div className="w-24 h-8 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
