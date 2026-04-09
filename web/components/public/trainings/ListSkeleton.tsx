// components/public/trainings/ListSkeleton.tsx
export default function ListSkeleton() {
  return (
    <div className="space-y-12">
      {/* Filter Tabs Skeleton */}
      <div className="flex flex-wrap justify-center gap-3">
        {[1, 2, 3, 4].map((i) => (
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
            className="h-[400px] rounded-[2rem] bg-slate-50 border border-slate-100 p-6 space-y-6"
          >
            <div className="w-full h-48 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="space-y-3">
              <div className="w-3/4 h-6 bg-slate-200 rounded-lg animate-pulse" />
              <div className="w-full h-4 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between">
              <div className="w-24 h-8 bg-slate-200 rounded-lg animate-pulse" />
              <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
