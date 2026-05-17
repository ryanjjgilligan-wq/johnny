import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsList, type BookingItem } from "@/components/bookings-list";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/signin?callbackUrl=/bookings");

  const bookings = await prisma.booking.findMany({
    where: { guestId: userId },
    include: { yard: { include: { host: true } } },
    orderBy: { startTime: "desc" },
  });

  const now = new Date();
  const upcoming: BookingItem[] = [];
  const past: BookingItem[] = [];
  const cancelled: BookingItem[] = [];

  for (const b of bookings) {
    const item: BookingItem = {
      id: b.id,
      status: b.status,
      startTime: b.startTime.toISOString(),
      endTime: b.endTime.toISOString(),
      dogCount: b.dogCount,
      totalPrice: b.totalPrice,
      yard: {
        id: b.yard.id,
        title: b.yard.title,
        city: b.yard.city,
        state: b.yard.state,
        neighborhood: b.yard.neighborhood,
        photo: parseJsonField<string[]>(b.yard.photos, [])[0],
        hostName: b.yard.host.name ?? "Host",
        hostImage: b.yard.host.image ?? null,
      },
    };
    if (b.status === "cancelled") cancelled.push(item);
    else if (b.endTime < now) past.push(item);
    else upcoming.push(item);
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-1">Trips</h1>
      <p className="text-muted-foreground text-sm mb-8">Your reservations, past and present.</p>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcoming.length === 0 ? <Empty /> : <BookingsList bookings={upcoming} cancellable />}
        </TabsContent>
        <TabsContent value="past">
          {past.length === 0 ? <Empty /> : <BookingsList bookings={past} />}
        </TabsContent>
        <TabsContent value="cancelled">
          {cancelled.length === 0 ? <Empty /> : <BookingsList bookings={cancelled} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty() {
  return (
    <div className="text-center py-16">
      <p className="text-muted-foreground mb-4">No bookings here yet.</p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-[#e8484e] transition-colors"
      >
        Find a yard
      </Link>
    </div>
  );
}
