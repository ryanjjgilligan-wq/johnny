import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import { CategoryRail } from "@/components/category-rail";
import { CityTabs } from "@/components/city-tabs";
import { YardCard, type YardCardData } from "@/components/yard-card";
import type { AmenityKey } from "@/lib/amenities";

export const dynamic = "force-dynamic";

const DEFAULT_CITY = "Seattle";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { amenity?: string; city?: string };
}) {
  const yards = await prisma.yard.findMany({
    include: { reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });

  const amenityFilter = searchParams.amenity;
  // Default to Seattle, WA. Explicit `?city=All` clears the filter.
  const activeCity = searchParams.city ?? DEFAULT_CITY;
  const cityFilter = activeCity === "All" ? null : activeCity;

  type Card = YardCardData & { amenities: AmenityKey[]; cityKey: string };

  const cards: Card[] = yards
    .map((y) => {
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
        pricePerHour: y.pricePerHour,
        photos,
        rating: ratingAvg,
        reviewCount: y.reviews.length,
        amenities,
        cityKey: y.city,
      };
    })
    .filter((y) => (cityFilter ? y.cityKey === cityFilter : true))
    .filter((y) => (amenityFilter ? y.amenities.includes(amenityFilter as AmenityKey) : true));

  return (
    <>
      <CityTabs activeCity={activeCity} />
      <CategoryRail />
      <section className="container py-6 md:py-8">
        {cards.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No yards match this filter. Try another city or amenity.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {cards.map((yard) => (
              <YardCard key={yard.id} yard={yard} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
