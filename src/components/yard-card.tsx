"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface YardCardData {
  id: string;
  title: string;
  city: string;
  state: string;
  neighborhood: string;
  pricePerHour: number;
  photos: string[];
  rating: number;
  reviewCount: number;
  distanceKm?: number | null;
}

export function YardCard({ yard }: { yard: YardCardData }) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [popKey, setPopKey] = useState(0);
  const photos = yard.photos.length ? yard.photos : ["/placeholder.svg"];

  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % photos.length);
  }
  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }
  function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLiked((l) => !l);
    setPopKey((k) => k + 1);
  }

  return (
    <Link
      href={`/yards/${yard.id}`}
      className="group block transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
        {photos.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={yard.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            priority={i === 0}
            className={cn(
              "object-cover transition-opacity duration-300",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        <button
          aria-label={liked ? "Unsave" : "Save"}
          onClick={toggleLike}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 hover:bg-black/10 transition-colors"
        >
          <Heart
            key={popKey}
            className={cn(
              "h-6 w-6 drop-shadow stroke-white stroke-2",
              liked ? "fill-primary stroke-primary heart-pop" : "fill-black/30",
            )}
          />
        </button>

        {photos.length > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden h-7 w-7 items-center justify-center rounded-full bg-white shadow group-hover:flex hover:scale-105 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next photo"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden h-7 w-7 items-center justify-center rounded-full bg-white shadow group-hover:flex hover:scale-105 transition-transform"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    i === index ? "bg-white" : "bg-white/60",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold truncate">
            {yard.neighborhood}, {yard.city}
          </div>
          <div className="text-sm text-muted-foreground truncate">{yard.title}</div>
          {yard.distanceKm != null && (
            <div className="text-sm text-muted-foreground">
              {yard.distanceKm < 1.5
                ? `${(yard.distanceKm * 1000).toFixed(0)} m away`
                : `${yard.distanceKm.toFixed(1)} km away`}
            </div>
          )}
          <div className="mt-1 text-sm">
            <span className="font-semibold">${yard.pricePerHour}</span>
            <span className="text-muted-foreground"> / hour</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm shrink-0">
          <Star className="h-4 w-4 fill-foreground" />
          <span>{yard.rating > 0 ? yard.rating.toFixed(2) : "New"}</span>
          {yard.reviewCount > 0 && (
            <span className="text-muted-foreground">({yard.reviewCount})</span>
          )}
        </div>
      </div>
    </Link>
  );
}
