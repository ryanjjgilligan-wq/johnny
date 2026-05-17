"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function BookingCard({
  yardId,
  pricePerHour,
  rating,
  reviewCount,
  maxDogs,
}: {
  yardId: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  maxDogs: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [startHour, setStartHour] = useState("10");
  const [duration, setDuration] = useState("1");
  const [dogs, setDogs] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hours = parseInt(duration, 10);
  const subtotal = hours * pricePerHour;
  const serviceFee = useMemo(() => Math.max(2, Math.round(subtotal * 0.12)), [subtotal]);
  const total = subtotal + serviceFee;

  async function reserve() {
    if (!session?.user) {
      router.push("/signin?callbackUrl=" + encodeURIComponent(`/yards/${yardId}`));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const startTime = new Date(`${date}T${startHour.padStart(2, "0")}:00:00`);
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yardId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          dogCount: parseInt(dogs, 10),
          totalPrice: total,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Booking failed");
      }
      router.push("/bookings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-pop">
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <span className="text-2xl font-semibold">${pricePerHour}</span>
          <span className="text-muted-foreground"> / hour</span>
        </div>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-foreground" />
            <span className="font-medium">{rating.toFixed(2)}</span>
            <span className="text-muted-foreground">· {reviewCount} reviews</span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-0 border rounded-xl overflow-hidden">
        <div className="p-3 border-r border-b">
          <label className="block text-[10px] font-bold uppercase tracking-wide">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-sm bg-transparent outline-none"
          />
        </div>
        <div className="p-3 border-b">
          <label className="block text-[10px] font-bold uppercase tracking-wide">Start</label>
          <select
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            className="w-full text-sm bg-transparent outline-none"
          >
            {Array.from({ length: 14 }, (_, i) => i + 7).map((h) => (
              <option key={h} value={String(h)}>
                {h % 12 === 0 ? 12 : h % 12}:00 {h < 12 ? "am" : "pm"}
              </option>
            ))}
          </select>
        </div>
        <div className="p-3 border-r">
          <label className="block text-[10px] font-bold uppercase tracking-wide">Hours</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full text-sm bg-transparent outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <option key={h} value={String(h)}>
                {h} hour{h > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="p-3">
          <label className="block text-[10px] font-bold uppercase tracking-wide">Dogs</label>
          <select
            value={dogs}
            onChange={(e) => setDogs(e.target.value)}
            className="w-full text-sm bg-transparent outline-none"
          >
            {Array.from({ length: maxDogs }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n} dog{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        variant="gradient"
        size="lg"
        className="mt-4 w-full"
        onClick={reserve}
        disabled={loading}
      >
        {loading ? "Reserving…" : session?.user ? "Reserve" : "Sign in to reserve"}
      </Button>

      {error && <div className="mt-3 text-sm text-destructive">{error}</div>}

      <p className="text-center text-xs text-muted-foreground mt-3">
        You won&apos;t be charged yet
      </p>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="underline">
            ${pricePerHour} × {hours} hour{hours > 1 ? "s" : ""}
          </span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">Barkyard service fee</span>
          <span>${serviceFee}</span>
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}
