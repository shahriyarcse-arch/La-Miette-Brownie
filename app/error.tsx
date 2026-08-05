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
    <div className="min-h-screen bg-[#F7F1E5] text-[#221B12] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12] mb-4">
        Something went wrong!
      </h2>
      <p className="text-[#4A3F2E] text-base max-w-md mb-8">
        We encountered an unexpected error while preparing your bakery experience.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3.5 rounded-full bg-[#221B12] text-[#F7F1E5] font-semibold hover:bg-[#B06A2C] transition-colors shadow-lg"
      >
        Try Again
      </button>
    </div>
  );
}
