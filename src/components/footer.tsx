import Link from "next/link";
import { PawPrint } from "lucide-react";

const cities = ["Seattle", "Portland", "Austin", "San Francisco", "Denver", "Chicago", "Brooklyn", "Atlanta"];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/40 mt-16">
      <div className="container py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <PawPrint className="h-6 w-6 text-primary" fill="#FF5A5F" />
            <span className="font-bold text-lg">barkyard</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Private backyards for dogs who don&apos;t love the dog park. Book a yard. Bring a tennis ball. Have a great day.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {cities.map((c) => (
              <li key={c}>
                <Link href={`/search?q=${encodeURIComponent(c)}`} className="hover:underline">
                  Yards in {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Hosting</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/host" className="hover:underline">List your yard</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Host dashboard</Link></li>
            <li><Link href="/host" className="hover:underline">Hosting resources</Link></li>
            <li><Link href="/host" className="hover:underline">Community forum</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:underline">Help Center</Link></li>
            <li><Link href="/" className="hover:underline">Trust &amp; safety</Link></li>
            <li><Link href="/" className="hover:underline">Cancellation options</Link></li>
            <li><Link href="/" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Barkyard, Inc. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Privacy</Link>
            <Link href="/" className="hover:underline">Terms</Link>
            <Link href="/" className="hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
