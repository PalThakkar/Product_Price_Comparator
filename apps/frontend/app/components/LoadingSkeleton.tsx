"use client";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 card-hover">
          <div className="flex gap-4">
            {/* Image skeleton */}
            <div className="w-24 h-24 bg-gray-300 rounded-lg skeleton" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-300 rounded w-3/4 skeleton" />
              <div className="h-4 bg-gray-300 rounded w-1/2 skeleton" />
              <div className="h-4 bg-gray-300 rounded w-2/3 skeleton" />
              <div className="flex gap-2 pt-2">
                <div className="h-8 bg-gray-300 rounded w-20 skeleton" />
                <div className="h-8 bg-gray-300 rounded w-24 skeleton" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
