"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ShelfCard, { ShelfMedia } from "./ShelfCard";

type Item = ShelfMedia & {
  id: number;
  media?: "movie" | "tv";
};

export default function ShelfRow({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 0);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const onScroll = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nudge = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const by = Math.round(el.clientWidth * 0.9) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: by, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="-mx-1 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar"
      >
        {items.map((m) => {
          if (!m?.id) return null;

          const href = `/${m.media ?? "movie"}/${m.id}`;

          return (
            <ShelfCard
              key={`${m.media ?? "movie"}-${m.id}`}
              item={m}
              href={href}
            />
          );
        })}
      </div>

      <button
        aria-label="Scroll left"
        onClick={() => nudge("left")}
        disabled={!canL}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full
                   bg-black/60 ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        aria-label="Scroll right"
        onClick={() => nudge("right")}
        disabled={!canR}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full
                   bg-black/60 ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
