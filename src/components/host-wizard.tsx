"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Check, ChevronLeft, ChevronRight, MapPin, ScrollText, Sparkles, Tag } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AMENITIES, AMENITY_ORDER, type AmenityKey } from "@/lib/amenities";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "photos", label: "Photos", icon: Camera },
  { key: "location", label: "Location", icon: MapPin },
  { key: "amenities", label: "Amenities", icon: Sparkles },
  { key: "rules", label: "Rules", icon: ScrollText },
  { key: "pricing", label: "Pricing", icon: Tag },
  { key: "publish", label: "Publish", icon: Check },
] as const;

const SAMPLE_PHOTO_POOL = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&q=80",
  "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200&q=80",
  "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=1200&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200&q=80",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80",
];

type FormState = {
  title: string;
  description: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: string;
  lng: string;
  pricePerHour: string;
  sqft: string;
  fenceHeight: string;
  maxDogs: string;
  rules: string;
  photos: string[];
  amenities: AmenityKey[];
};

const INITIAL: FormState = {
  title: "",
  description: "",
  neighborhood: "",
  city: "",
  state: "",
  lat: "47.6062",
  lng: "-122.3321",
  pricePerHour: "15",
  sqft: "5000",
  fenceHeight: "6",
  maxDogs: "3",
  rules: "Please clean up after your dog.",
  photos: SAMPLE_PHOTO_POOL.slice(0, 4),
  amenities: ["fully_fenced", "shade"],
};

export function HostWizard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleAmenity(a: AmenityKey) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  function togglePhoto(url: string) {
    setForm((f) => ({
      ...f,
      photos: f.photos.includes(url)
        ? f.photos.filter((p) => p !== url)
        : [...f.photos, url],
    }));
  }

  async function submit() {
    if (!session?.user) {
      router.push("/signin?callbackUrl=/host");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/yards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        pricePerHour: parseInt(form.pricePerHour),
        sqft: parseInt(form.sqft),
        fenceHeight: parseInt(form.fenceHeight),
        maxDogs: parseInt(form.maxDogs),
        rules: form.rules,
        photos: form.photos,
        amenities: form.amenities,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not publish listing.");
      return;
    }
    const data = await res.json();
    router.push(`/yards/${data.id}`);
    router.refresh();
  }

  const canContinue = (() => {
    switch (STEPS[step].key) {
      case "photos":
        return form.photos.length >= 1;
      case "location":
        return form.city.trim() && form.state.trim() && form.neighborhood.trim();
      case "amenities":
        return form.amenities.length > 0;
      case "rules":
        return form.title.trim().length >= 3 && form.description.trim().length >= 20;
      case "pricing":
        return parseInt(form.pricePerHour) > 0;
      default:
        return true;
    }
  })();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isDone = i < step;
          const isCurrent = i === step;
          return (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap",
                isCurrent && "border-foreground bg-foreground text-white",
                isDone && "border-emerald-300 bg-emerald-50 text-emerald-700",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-card min-h-[420px]">
        {STEPS[step].key === "photos" && (
          <div>
            <h2 className="text-xl font-semibold">Pick your yard photos</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Demo mode — choose from the sample gallery below. Click to include or remove.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SAMPLE_PHOTO_POOL.map((url) => {
                const selected = form.photos.includes(url);
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => togglePhoto(url)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                      selected ? "border-primary ring-2 ring-primary/30" : "border-transparent",
                    )}
                  >
                    <Image
                      src={url}
                      alt="yard photo"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    {selected && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {STEPS[step].key === "location" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Where is your yard?</h2>
            <p className="text-sm text-muted-foreground">
              Only your neighborhood is shown publicly. Exact location is shared after booking.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  value={form.neighborhood}
                  onChange={(e) => update("neighborhood", e.target.value)}
                  placeholder="Ballard"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Seattle"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="WA"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    value={form.lat}
                    onChange={(e) => update("lat", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    value={form.lng}
                    onChange={(e) => update("lng", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {STEPS[step].key === "amenities" && (
          <div>
            <h2 className="text-xl font-semibold mb-1">What does your yard offer?</h2>
            <p className="text-sm text-muted-foreground mb-4">Pick everything that applies.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITY_ORDER.map((k) => {
                const a = AMENITIES[k];
                const Icon = a.icon;
                const on = form.amenities.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleAmenity(k)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 text-left transition-colors",
                      on
                        ? "border-foreground bg-secondary"
                        : "hover:border-foreground/40",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {STEPS[step].key === "rules" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tell guests about your yard</h2>
            <div>
              <Label htmlFor="title">Listing title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Fenced Half-Acre with Splash Pad"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe your yard — what makes it special, the size, layout, and any standout features…"
                className="min-h-[140px] w-full rounded-lg border bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <Label htmlFor="rules">House rules (optional)</Label>
              <textarea
                id="rules"
                value={form.rules}
                onChange={(e) => update("rules", e.target.value)}
                className="min-h-[80px] w-full rounded-lg border bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}

        {STEPS[step].key === "pricing" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Set your details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price per hour ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.pricePerHour}
                  onChange={(e) => update("pricePerHour", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sqft">Yard size (sq ft)</Label>
                <Input
                  id="sqft"
                  type="number"
                  value={form.sqft}
                  onChange={(e) => update("sqft", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fence">Fence height (ft)</Label>
                <Input
                  id="fence"
                  type="number"
                  value={form.fenceHeight}
                  onChange={(e) => update("fenceHeight", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dogs">Max dogs per booking</Label>
                <Input
                  id="dogs"
                  type="number"
                  value={form.maxDogs}
                  onChange={(e) => update("maxDogs", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {STEPS[step].key === "publish" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ready to publish?</h2>
            <p className="text-sm text-muted-foreground">
              Review your listing details below. You can edit anytime from your host dashboard.
            </p>
            <div className="rounded-xl border p-4 space-y-2 text-sm">
              <div className="font-semibold">{form.title || "(no title yet)"}</div>
              <div className="text-muted-foreground">
                {form.neighborhood}, {form.city}, {form.state}
              </div>
              <div>
                ${form.pricePerHour}/hour · {form.sqft} sq ft · {form.fenceHeight}ft fence · up to {form.maxDogs} dogs
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.amenities.map((a) => (
                  <span key={a} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {AMENITIES[a].short}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2">
                {form.photos.slice(0, 4).map((p) => (
                  <div key={p} className="relative aspect-square rounded-md overflow-hidden">
                    <Image src={p} alt="" fill sizes="100px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? "Publishing…" : "Publish listing"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        {step < STEPS.length - 1 && (
          <Button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canContinue}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
