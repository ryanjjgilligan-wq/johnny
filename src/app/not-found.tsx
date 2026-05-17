import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">We couldn&apos;t find that page.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-[#e8484e] transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
