"use client";

export function EarningsChart({ data }: { data: { month: string; amount: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
        No earnings yet.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((d) => {
        const h = Math.max(8, (d.amount / max) * 160);
        const label = new Date(d.month + "-01").toLocaleDateString("en-US", {
          month: "short",
        });
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-xs font-medium">${d.amount}</div>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[#FF5A5F] to-[#FFA0A4] transition-all"
              style={{ height: `${h}px` }}
            />
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
