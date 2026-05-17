"use client";

import dynamic from "next/dynamic";

const InternalMap = dynamic(() => import("./yard-map-internal"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-2xl bg-secondary animate-pulse" />
  ),
});

export function YardMap(props: {
  center: { lat: number; lng: number };
  approximate?: boolean;
  label?: string;
}) {
  return <InternalMap {...props} />;
}
