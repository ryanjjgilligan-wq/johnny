"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AMENITIES, AMENITY_ORDER, type AmenityKey } from "@/lib/amenities";
import { cn } from "@/lib/utils";

export function CategoryRail() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("amenity") as AmenityKey | null;

  function setAmenity(key: AmenityKey) {
    const next = new URLSearchParams(params.toString());
    if (active === key) next.delete("amenity");
    else next.set("amenity", key);
    router.push(`/?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="border-b">
      <div className="container">
        <div className="no-scrollbar overflow-x-auto">
          <div className="flex items-center gap-8 py-3 min-w-max">
            {AMENITY_ORDER.map((k) => {
              const a = AMENITIES[k];
              const Icon = a.icon;
              const isActive = active === k;
              return (
                <button
                  key={k}
                  onClick={() => setAmenity(k)}
                  className={cn(
                    "group flex flex-col items-center gap-1 pb-2 border-b-2 transition-colors min-w-[64px]",
                    isActive
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium whitespace-nowrap">{a.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
