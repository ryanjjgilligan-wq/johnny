"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchPill() {
  const router = useRouter();
  const [where, setWhere] = useState("");
  const [date, setDate] = useState("");
  const [dogSize, setDogSize] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (where) params.set("q", where);
    if (date) params.set("date", date);
    if (dogSize) params.set("size", dogSize);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center divide-x rounded-full border bg-white shadow-sm hover:shadow transition-shadow"
    >
      <div className="px-5 py-2">
        <label className="block text-[11px] font-semibold uppercase tracking-wide">Where</label>
        <input
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Search yards"
          className="w-32 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="px-5 py-2">
        <label className="block text-[11px] font-semibold uppercase tracking-wide">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-32 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="px-5 py-2">
        <label className="block text-[11px] font-semibold uppercase tracking-wide">Dog size</label>
        <select
          value={dogSize}
          onChange={(e) => setDogSize(e.target.value)}
          className="w-28 bg-transparent text-sm outline-none"
        >
          <option value="">Any</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="px-2 py-1.5">
        <button
          type="submit"
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-[#e8484e]"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
