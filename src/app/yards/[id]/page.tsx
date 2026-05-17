import Image from "next/image";
import { notFound } from "next/navigation";
import { Fence, MapPin, Maximize, Ruler, Star, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import { AMENITIES, type AmenityKey } from "@/lib/amenities";
import { YardGallery } from "@/components/yard-gallery";
import { YardMap } from "@/components/yard-map";
import { BookingCard } from "@/components/booking-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function YardPage({ params }: { params: { id: string } }) {
  const yard = await prisma.yard.findUnique({
    where: { id: params.id },
    include: {
      host: true,
      reviews: { include: { guest: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!yard) notFound();

  const photos = parseJsonField<string[]>(yard.photos, []);
  const amenities = parseJsonField<AmenityKey[]>(yard.amenities, []);
  const ratingAvg =
    yard.reviews.length > 0
      ? yard.reviews.reduce((s, r) => s + r.rating, 0) / yard.reviews.length
      : 0;

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{yard.title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {yard.reviews.length > 0 && (
            <>
              <span className="flex items-center gap-1 text-foreground">
                <Star className="h-4 w-4 fill-foreground" />
                <span className="font-medium">{ratingAvg.toFixed(2)}</span>
              </span>
              <span>·</span>
              <span className="underline">{yard.reviews.length} reviews</span>
              <span>·</span>
            </>
          )}
          <span className="underline">
            {yard.neighborhood}, {yard.city}, {yard.state}
          </span>
        </div>
      </div>

      <YardGallery photos={photos} title={yard.title} />

      <div className="grid lg:grid-cols-3 gap-12 mt-10">
        <div className="lg:col-span-2">
          <section className="pb-8 border-b flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                Hosted by {yard.host.name?.split(" ")[0] ?? "your host"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Up to {yard.maxDogs} dogs · {yard.sqft.toLocaleString()} sq ft · {yard.fenceHeight} ft fence
              </p>
            </div>
            <Avatar className="h-14 w-14">
              {yard.host.image ? <AvatarImage src={yard.host.image} alt={yard.host.name ?? ""} /> : null}
              <AvatarFallback>{yard.host.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </section>

          <section className="py-8 border-b space-y-5">
            <Feature
              icon={Fence}
              title={`Fully fenced ${yard.fenceHeight} ft perimeter`}
              body="Every inch of the yard is enclosed — perfect for off-leash play."
            />
            <Feature
              icon={Maximize}
              title={`${yard.sqft.toLocaleString()} sq ft of space`}
              body="Plenty of room to run, zoom, and explore."
            />
            <Feature
              icon={Users}
              title={`Up to ${yard.maxDogs} dogs welcome`}
              body="Bring the whole pack — or just your favorite one."
            />
          </section>

          <section className="py-8 border-b">
            <p className="whitespace-pre-line leading-relaxed">{yard.description}</p>
          </section>

          <section className="py-8 border-b">
            <h2 className="text-xl font-semibold mb-5">What this yard offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenities.map((key) => {
                const a = AMENITIES[key];
                if (!a) return null;
                const Icon = a.icon;
                return (
                  <div key={key} className="flex items-center gap-3 text-sm">
                    <Icon className="h-5 w-5 text-foreground/80" />
                    <span>{a.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {yard.rules && (
            <section className="py-8 border-b">
              <h2 className="text-xl font-semibold mb-3">Things to know</h2>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {yard.rules}
              </p>
            </section>
          )}

          <section className="py-8 border-b">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Where you&apos;ll be</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {yard.neighborhood}, {yard.city}, {yard.state} — exact address shared after booking
            </p>
            <div className="h-[360px]">
              <YardMap center={{ lat: yard.lat, lng: yard.lng }} approximate />
            </div>
          </section>

          <section className="py-8">
            <div className="flex items-center gap-2 mb-5">
              <Star className="h-5 w-5 fill-foreground" />
              <h2 className="text-xl font-semibold">
                {ratingAvg > 0 ? ratingAvg.toFixed(2) : "New"} · {yard.reviews.length} reviews
              </h2>
            </div>
            {yard.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">Be the first to review this yard.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                {yard.reviews.map((r) => (
                  <div key={r.id}>
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        {r.guest.image ? (
                          <AvatarImage src={r.guest.image} alt={r.guest.name ?? ""} />
                        ) : null}
                        <AvatarFallback>{r.guest.name?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{r.guest.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={
                            "h-3.5 w-3.5 " +
                            (i < r.rating ? "fill-foreground" : "fill-secondary text-secondary")
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingCard
              yardId={yard.id}
              pricePerHour={yard.pricePerHour}
              rating={ratingAvg}
              reviewCount={yard.reviews.length}
              maxDogs={yard.maxDogs}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-6 w-6 mt-1 text-foreground/80" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
