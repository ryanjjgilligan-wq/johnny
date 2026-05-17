import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowUpRight, CalendarDays, DollarSign, Home, Star } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import { EarningsChart } from "@/components/earnings-chart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/signin?callbackUrl=/dashboard");

  const yards = await prisma.yard.findMany({
    where: { hostId: userId },
    include: {
      reviews: true,
      bookings: { orderBy: { startTime: "desc" } },
    },
  });

  if (yards.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">No listings yet</h1>
        <p className="mt-2 text-muted-foreground">
          Host your first yard to start earning.
        </p>
        <Link
          href="/host"
          className="mt-6 inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-[#e8484e] transition-colors"
        >
          List your yard
        </Link>
      </div>
    );
  }

  const allBookings = yards.flatMap((y) => y.bookings.map((b) => ({ ...b, yardTitle: y.title })));
  const confirmedBookings = allBookings.filter((b) => b.status !== "cancelled");
  const totalEarnings = confirmedBookings.reduce((s, b) => s + b.totalPrice, 0);
  const totalBookings = confirmedBookings.length;
  const upcomingBookings = confirmedBookings.filter((b) => b.endTime > new Date()).length;
  const totalReviews = yards.reduce((s, y) => s + y.reviews.length, 0);
  const avgRating =
    totalReviews > 0
      ? yards.reduce((s, y) => s + y.reviews.reduce((a, r) => a + r.rating, 0), 0) / totalReviews
      : 0;

  // Group earnings by month for chart
  const earningsByMonth = new Map<string, number>();
  for (const b of confirmedBookings) {
    const k = b.startTime.toISOString().slice(0, 7);
    earningsByMonth.set(k, (earningsByMonth.get(k) ?? 0) + b.totalPrice);
  }
  const chartData = Array.from(earningsByMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, amount]) => ({ month, amount }));

  return (
    <div className="container py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Host dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here&apos;s how your yards are doing.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={DollarSign} label="Total earnings" value={`$${totalEarnings}`} />
        <Stat icon={CalendarDays} label="Bookings" value={String(totalBookings)} />
        <Stat icon={Home} label="Listings" value={String(yards.length)} />
        <Stat icon={Star} label="Avg rating" value={avgRating > 0 ? avgRating.toFixed(2) : "—"} />
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Earnings — last 6 months</h2>
            <p className="text-xs text-muted-foreground">
              {upcomingBookings} upcoming booking{upcomingBookings === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <EarningsChart data={chartData} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your listings</h2>
          <Link
            href="/host"
            className="inline-flex items-center text-sm font-medium hover:underline"
          >
            Add a new listing <ArrowUpRight className="h-4 w-4 ml-0.5" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {yards.map((y) => {
            const photos = parseJsonField<string[]>(y.photos, []);
            const yardRating =
              y.reviews.length > 0
                ? y.reviews.reduce((s, r) => s + r.rating, 0) / y.reviews.length
                : 0;
            const yardEarnings = y.bookings
              .filter((b) => b.status !== "cancelled")
              .reduce((s, b) => s + b.totalPrice, 0);
            return (
              <Link
                key={y.id}
                href={`/yards/${y.id}`}
                className="flex gap-4 rounded-2xl border bg-white shadow-card p-3 hover:shadow-pop transition-shadow"
              >
                <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                  {photos[0] && (
                    <Image src={photos[0]} alt={y.title} fill sizes="120px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{y.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {y.neighborhood}, {y.city}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                    <div>
                      <div className="text-muted-foreground">Bookings</div>
                      <div className="font-semibold">{y.bookings.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Earned</div>
                      <div className="font-semibold">${yardEarnings}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rating</div>
                      <div className="font-semibold">{yardRating > 0 ? yardRating.toFixed(1) : "—"}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent bookings</h2>
        <div className="rounded-2xl border bg-white shadow-card overflow-hidden">
          {allBookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No bookings yet. Your calendar will fill up.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Yard</th>
                  <th className="text-left px-4 py-3">When</th>
                  <th className="text-left px-4 py-3">Dogs</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.slice(0, 10).map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-3 truncate max-w-[200px]">{b.yardTitle}</td>
                    <td className="px-4 py-3">
                      {b.startTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">{b.dogCount}</td>
                    <td className="px-4 py-3">${b.totalPrice}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-xs " +
                          (b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : b.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700")
                        }
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs uppercase tracking-wide">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
