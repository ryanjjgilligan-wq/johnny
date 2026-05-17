"use client";

import Image from "next/image";
import { useState } from "react";
import { Grid3x3, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function YardGallery({ photos, title }: { photos: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const display = photos.slice(0, 5);

  return (
    <>
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden md:h-[420px]">
        <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto h-full">
          <Image
            src={display[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        {display.slice(1, 5).map((src, i) => (
          <div key={src + i} className="relative hidden md:block">
            <Image
              src={src}
              alt={`${title} photo ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        ))}
        <button
          onClick={() => setOpen(true)}
          className="absolute right-4 bottom-4 flex items-center gap-2 bg-white border rounded-lg px-3 py-2 text-sm font-medium shadow hover:shadow-md transition-shadow"
        >
          <Grid3x3 className="h-4 w-4" /> Show all photos
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{title} — all photos</DialogTitle>
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="font-semibold">{title}</h3>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 hover:bg-secondary"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 max-h-[70vh] overflow-y-auto">
            {photos.map((src, i) => (
              <div key={src + i} className="relative aspect-[4/3]">
                <Image
                  src={src}
                  alt={`${title} ${i + 1}`}
                  fill
                  sizes="50vw"
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
