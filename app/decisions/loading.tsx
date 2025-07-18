import { Skeleton } from "@/components/ui/skeleton"

export default function DecisionsLoading() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2 bg-slate-700" />
          <Skeleton className="h-4 w-96 bg-slate-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <Skeleton className="h-4 w-20 mb-2 bg-slate-700" />
              <Skeleton className="h-8 w-12 bg-slate-700" />
            </div>
          ))}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-6">
            <Skeleton className="h-6 w-32 mb-4 bg-slate-700" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                  <Skeleton className="h-4 w-48 bg-slate-700" />
                  <Skeleton className="h-4 w-32 bg-slate-700" />
                  <Skeleton className="h-4 w-20 bg-slate-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
