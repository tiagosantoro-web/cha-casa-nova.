"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/icons";

/** Foto do presente com reserva visual (ícone da categoria) quando falta ou falha. */
export function GiftImage({ src, alt, category }: { src: string | null; alt: string; category: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grain grid size-full place-items-center bg-stone-soft">
        <span className="steel grid size-24 place-items-center rounded-full shadow-card ring-8 ring-card/60">
          <CategoryIcon slug={category} className="size-11 text-ink" strokeWidth={1.3} />
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagens vêm de lojas e do Storage, cadastradas no painel
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-full object-contain p-4 mix-blend-multiply"
    />
  );
}
