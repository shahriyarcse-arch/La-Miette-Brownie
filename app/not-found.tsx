import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#221B12] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl md:text-9xl font-serif font-bold text-[#B06A2C] mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#221B12] mb-4">
        Page Not Found
      </h2>
      <p className="text-[#4A3F2E] text-base max-w-md mb-8">
        The delicate dessert page you are looking for seems to have been freshly enjoyed.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-full bg-[#221B12] text-[#F7F1E5] font-semibold hover:bg-[#B06A2C] transition-colors shadow-lg"
      >
        Return To Dessert Boutique
      </Link>
    </div>
  );
}
