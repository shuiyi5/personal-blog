export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-purple-500 animate-spin [animation-direction:reverse] [animation-duration:0.8s]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold gradient-text">S</span>
          </div>
        </div>
        {/* Shimmer bar */}
        <div className="w-32 h-0.5 rounded-full bg-[var(--border)] overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-accent to-purple-500 animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
