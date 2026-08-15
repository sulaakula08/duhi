import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-x pb-24 pt-36 md:pt-44">
      <span className="sr-only" role="status">
        Загрузка
      </span>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-6 h-20 w-full max-w-xl" />
      <Skeleton className="mt-4 h-20 w-full max-w-md" />
      <div className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
