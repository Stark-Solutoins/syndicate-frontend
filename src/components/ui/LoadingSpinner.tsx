export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-bg-card border border-white/[0.08] rounded-xl p-6 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-8 bg-white/10 rounded w-2/3" />
        <div className="h-3 bg-white/10 rounded w-full" />
      </div>
    </div>
  )
}
