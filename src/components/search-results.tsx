"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { YardCard, type YardCardData } from "@/components/yard-card";
import { AMENITIES, AMENITY_ORDER, type AmenityKey } from "@/lib/amenities";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const SearchMap = dynamic(() => import("./search-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-secondary animate-pulse" />,
});

export interface SearchYard extends YardCardData {
  lat: number;
  lng: number;
  sqft: number;
  fenceHeight: number;
  amenities: AmenityKey[];
}

export function SearchResults({ yards, query }: { yards: SearchYard[]; query: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const minSqft = params.get("minSqft") ?? "";
  const minFence = params.get("minFence") ?? "";
  const activeAmenity = params.get("amenity") as AmenityKey | null;

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/search?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      <div className="flex-1 lg:max-w-[60%] xl:max-w-[58%] p-4 md:p-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold">
            {yards.length} yard{yards.length === 1 ? "" : "s"}
            {query ? <span className="text-muted-foreground"> for &ldquo;{query}&rdquo;</span> : null}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Privacy first — pins show approximate location until you book.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <FilterChip label="Any price" active={!minPrice && !maxPrice}>
            <div className="flex items-center gap-2 p-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                className="w-20 rounded border px-2 py-1 text-sm"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className="w-20 rounded border px-2 py-1 text-sm"
              />
            </div>
          </FilterChip>
          <FilterChip label={`Min sq ft${minSqft ? `: ${minSqft}` : ""}`} active={!!minSqft}>
            <div className="p-3 flex gap-2">
              {[0, 2500, 5000, 10000, 20000].map((s) => (
                <button
                  key={s}
                  onClick={() => updateParam("minSqft", s ? String(s) : null)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    String(s) === minSqft || (!s && !minSqft) ? "border-foreground" : "",
                  )}
                >
                  {s === 0 ? "Any" : `${s.toLocaleString()}+`}
                </button>
              ))}
            </div>
          </FilterChip>
          <FilterChip label={`Min fence${minFence ? `: ${minFence}ft` : ""}`} active={!!minFence}>
            <div className="p-3 flex gap-2">
              {[0, 4, 5, 6].map((f) => (
                <button
                  key={f}
                  onClick={() => updateParam("minFence", f ? String(f) : null)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    String(f) === minFence || (!f && !minFence) ? "border-foreground" : "",
                  )}
                >
                  {f === 0 ? "Any" : `${f}ft+`}
                </button>
              ))}
            </div>
          </FilterChip>
          {AMENITY_ORDER.map((k) => {
            const a = AMENITIES[k];
            const isActive = activeAmenity === k;
            const Icon = a.icon;
            return (
              <button
                key={k}
                onClick={() => updateParam("amenity", isActive ? null : k)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-white"
                    : "hover:border-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {a.short}
              </button>
            );
          })}
        </div>

        {yards.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No yards match your filters. Try widening your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {yards.map((y) => (
              <div
                key={y.id}
                onMouseEnter={() => setHoverId(y.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <YardCard yard={y} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block flex-1 sticky top-20 h-[calc(100vh-80px)]">
        <SearchMap yards={yards} hoverId={hoverId} />
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  children,
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs transition-colors hover:border-foreground",
          active ? "border-foreground bg-foreground text-white" : "",
        )}
      >
        {label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 rounded-xl border bg-white shadow-pop animate-slide-up">
            {children}
          </div>
        </>
      )}
    </div>
  );
}
