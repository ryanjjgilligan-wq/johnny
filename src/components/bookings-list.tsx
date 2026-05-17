"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface BookingItem {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  dogCount: number;
  totalPrice: number;
  yard: {
    id: string;
    title: string;
    city: string;
    state: string;
    neighborhood: string;
    photo?: string;
    hostName: string;
    hostImage: string | null;
  };
}

export function BookingsList({
  bookings,
  cancellable = false,
}: {
  bookings: BookingItem[];
  cancellable?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bookings.map((b) => (
        <BookingCardItem key={b.id} booking={b} cancellable={cancellable} />
      ))}
    </div>
  );
}

function BookingCardItem({
  booking,
  cancellable,
}: {
  booking: BookingItem;
  cancellable: boolean;
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));

  async function cancel() {
    if (!confirm("Cancel this reservation?")) return;
    setCancelling(true);
    const res = await fetch(`/api/bookings/${booking.id}/cancel`, { method: "POST" });
    setCancelling(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-2xl border bg-white shadow-card overflow-hidden flex">
      <Link
        href={`/yards/${booking.yard.id}`}
        className="relative w-32 h-32 sm:w-44 sm:h-44 flex-shrink-0 bg-secondary"
      >
        {booking.yard.photo && (
          <Image
            src={booking.yard.photo}
            alt={booking.yard.title}
            fill
            sizes="180px"
            className="object-cover"
          />
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col min-w-0">
        <Link href={`/yards/${booking.yard.id}`}>
          <div className="font-semibold truncate">{booking.yard.title}</div>
          <div className="text-xs text-muted-foreground">
            {booking.yard.neighborhood}, {booking.yard.city}, {booking.yard.state}
          </div>
        </Link>
        <div className="mt-2 text-sm">
          <div>
            {start.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
            {" · "}
            {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            {" – "}
            {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </div>
          <div className="text-xs text-muted-foreground">
            {hours} hour{hours > 1 ? "s" : ""} · {booking.dogCount} dog{booking.dogCount > 1 ? "s" : ""} · ${booking.totalPrice}
          </div>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-7 w-7">
              {booking.yard.hostImage ? (
                <AvatarImage src={booking.yard.hostImage} alt={booking.yard.hostName} />
              ) : null}
              <AvatarFallback>{booking.yard.hostName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              Hosted by {booking.yard.hostName.split(" ")[0]}
            </span>
          </div>
          {cancellable && booking.status === "confirmed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={cancel}
              disabled={cancelling}
            >
              {cancelling ? "…" : "Cancel"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
