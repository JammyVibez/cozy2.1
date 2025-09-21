export function PostSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-xl shadow-sm animate-pulse">
      <div className="p-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-muted rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-24 mb-1"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        
        {/* Media skeleton */}
        <div className="h-48 bg-muted rounded-lg mb-4"></div>
        
        {/* Actions skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex gap-4">
            <div className="h-8 w-16 bg-muted rounded"></div>
            <div className="h-8 w-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
