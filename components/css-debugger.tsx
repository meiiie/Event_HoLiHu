"use client"

export function CSSDebugger() {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 text-xs">
      <div className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="bg-black/70 text-white px-2 py-1 rounded-md backdrop-blur-sm">
        CSS loaded - v1.0.3
      </span>
    </div>
  );
}
