import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({
  yardId: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  dogCount: z.number().int().positive().max(20),
  totalPrice: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking" }, { status: 400 });
  }

  const { yardId, startTime, endTime, dogCount, totalPrice } = parsed.data;
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (end <= start) {
    return NextResponse.json({ error: "End must be after start" }, { status: 400 });
  }

  const yard = await prisma.yard.findUnique({ where: { id: yardId } });
  if (!yard) return NextResponse.json({ error: "Yard not found" }, { status: 404 });
  if (dogCount > yard.maxDogs) {
    return NextResponse.json(
      { error: `This yard allows up to ${yard.maxDogs} dogs.` },
      { status: 400 },
    );
  }

  // Check overlap
  const overlap = await prisma.booking.findFirst({
    where: {
      yardId,
      status: "confirmed",
      startTime: { lt: end },
      endTime: { gt: start },
    },
  });
  if (overlap) {
    return NextResponse.json({ error: "That time slot is already booked." }, { status: 409 });
  }

  // Stripe is stubbed unless keys are present. We confirm instantly either way for the demo.
  const booking = await prisma.booking.create({
    data: {
      yardId,
      guestId: userId,
      startTime: start,
      endTime: end,
      dogCount,
      totalPrice,
      status: "confirmed",
    },
  });

  return NextResponse.json({ id: booking.id });
}
