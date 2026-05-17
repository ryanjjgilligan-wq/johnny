import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

// On Vercel, only /tmp is writable. We seed dev.db at build time, then copy it
// to /tmp at runtime so mutations (bookings, reviews) work within a warm
// function lifecycle. Locally, we use prisma/dev.db directly.

function resolveDatabaseUrl(): string {
  const isVercel = !!process.env.VERCEL;
  if (!isVercel) {
    return process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  }

  const runtimePath = "/tmp/barkyard.db";
  const seedPath = path.join(process.cwd(), "prisma", "dev.db");

  try {
    if (!fs.existsSync(runtimePath) && fs.existsSync(seedPath)) {
      fs.copyFileSync(seedPath, runtimePath);
    }
  } catch (err) {
    console.error("Failed to copy seed DB to /tmp:", err);
  }

  return `file:${runtimePath}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: resolveDatabaseUrl() },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
