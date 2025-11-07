import { Skeleton } from "@/components/ui/skeleton"

// Skeleton del sidebar para desktop
export function SidebarSkeleton() {
  return (
    <div className="flex h-screen w-[--sidebar-width] flex-col border-r border-border bg-sidebar-background">
      {/* Header skeleton */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-border">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 p-2 space-y-2">
        {/* Menu items skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-8 w-full rounded-md" />
            {i === 0 && (
              <div className="ml-4 space-y-1">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-6 w-2/3 rounded-md" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer skeleton */}
      <div className="p-2 border-t border-border">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  )
}

// Skeleton del header/navbar
export function HeaderSkeleton() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-10 bg-background border-b border-border min-w-0">
      <div className="flex items-center gap-2 px-4">
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-2 px-4">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </header>
  )
}