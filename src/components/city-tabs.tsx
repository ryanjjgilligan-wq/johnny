"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CITIES = [
  { key: "Seattle", label: "Seattle, WA" },
  { key: "Portland", label: "Portland, OR" },
  { key: "Austin", label: "Austin, TX" },
  { key: "All", label: "All cities" },
];

export function CityTabs({ activeCity }: { activeCity: string }) {
  const params = useSearchParams();

  function hrefFor(key: string) {
    const next = new URLSearchParams(params.toString());
    if (key === "All") next.delete("city");
    else next.set("city", key);
    const q = next.toString();
    return q ? `/?${q}` : "/";
  }

  return (
    <div className="border-b">
      <div className="container">
        <div className="no-scrollbar overflow-x-auto">
          <div className="flex items-center gap-2 py-3 min-w-max">
            {CITIES.map((c) => {
              const active = activeCity === c.key;
              return (
                <Link
                  key={c.key}
                  href={hrefFor(c.key)}
                  scroll={false}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                    active
                      ? "border-foreground bg-foreground text-white"
                      : "hover:border-foreground/50",
                  )}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
