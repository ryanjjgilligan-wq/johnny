import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import type { AmenityKey } from "@/lib/amenities";
import { SearchResults, type SearchYard } from "@/components/search-results";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    minSqft?: string;
    minFence?: string;
    amenity?: string;
    size?: string;
  };
}) {
  const yards = await prisma.yard.findMany({
    include: { reviews: { select: { rating: true } } },
  });

  const q = searchParams.q?.toLowerCase().trim();
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : 0;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : 9999;
  const minSqft = searchParams.minSqft ? parseInt(searchParams.minSqft) : 0;
  const minFence = searchParams.minFence ? parseInt(searchParams.minFence) : 0;
  const amenity = searchParams.amenity as AmenityKey | undefined;
  const size = searchParams.size;

  const all: SearchYard[] = yards.map((y) => {
    const amenities = parseJsonField<AmenityKey[]>(y.amenities, []);
    const photos = parseJsonField<string[]>(y.photos, []);
    const ratingAvg =
      y.reviews.length > 0
        ? y.reviews.reduce((s, r) => s + r.rating, 0) / y.reviews.length
        : 0;
    return {
      id: y.id,
      title: y.title,
      city: y.city,
      state: y.state,
      neighborhood: y.neighborhood,
      lat: y.lat,
      lng: y.lng,
      pricePerHour: y.pricePerHour,
      sqft: y.sqft,
      fenceHeight: y.fenceHeight,
      photos,
      amenities,
      rating: ratingAvg,
      reviewCount: y.reviews.length,
    };
  });

  const filtered = all.filter((y) => {
    if (q) {
      const hay = `${y.title} ${y.city} ${y.state} ${y.neighborhood}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (y.pricePerHour < minPrice || y.pricePerHour > maxPrice) return false;
    if (y.sqft < minSqft) return false;
    if (y.fenceHeight < minFence) return false;
    if (amenity && !y.amenities.includes(amenity)) return false;
    if (size === "small" && !y.amenities.includes("small_dogs")) {
      // Small dogs welcome anywhere — but only filter if user explicitly wants small-only
    }
    return true;
  });

  return <SearchResults yards={filtered} query={q ?? ""} />;
}
