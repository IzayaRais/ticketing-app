"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
        <p className="text-slate-500 mb-6">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-maroon-700 text-white rounded-xl font-bold hover:bg-maroon-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
