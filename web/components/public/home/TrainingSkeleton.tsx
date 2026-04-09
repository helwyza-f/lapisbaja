// components/public/home/TrainingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function TrainingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`border border-slate-100 p-6 space-y-4 bg-white rounded-2xl ${i > 3 ? "hidden lg:block" : "block"}`}
        >
          {/* Badge Placeholder */}
          <Skeleton className="h-3 w-1/2 bg-slate-100 rounded-full" />

          {/* Title Placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full bg-slate-200 rounded-md" />
            <Skeleton className="h-5 w-4/5 bg-slate-200 rounded-md" />
          </div>

          {/* Info Lines */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-3 w-full bg-slate-50 rounded-md" />
            <Skeleton className="h-3 w-2/3 bg-slate-50 rounded-md" />
          </div>

          {/* Price & Button */}
          <div className="pt-6 flex flex-col gap-3">
            <Skeleton className="h-4 w-1/3 bg-slate-100 rounded-md" />
            <Skeleton className="h-10 w-full bg-primary/10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
