import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const yardSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  pricePerHour: z.number().int().positive(),
  sqft: z.number().int().positive(),
  fenceHeight: z.number().int().positive(),
  maxDogs: z.number().int().positive().max(20),
  photos: z.array(z.string().url()).min(1).max(10),
  amenities: z.array(z.string()).min(1),
  rules: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = yardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid yard", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  await prisma.user.update({
    where: { id: userId },
    data: { isHost: true },
  });

  const yard = await prisma.yard.create({
    data: {
      hostId: userId,
      title: data.title,
      description: data.description,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      lat: data.lat,
      lng: data.lng,
      pricePerHour: data.pricePerHour,
      sqft: data.sqft,
      fenceHeight: data.fenceHeight,
      maxDogs: data.maxDogs,
      photos: JSON.stringify(data.photos),
      amenities: JSON.stringify(data.amenities),
      rules: data.rules ?? null,
    },
  });

  return NextResponse.json({ id: yard.id });
}
