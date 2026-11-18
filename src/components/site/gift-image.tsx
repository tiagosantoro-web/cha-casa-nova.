"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/icons";
import { publicPath } from "@/lib/paths";

/** Foto do anúncio; sem foto (ou se ela falhar), mostra um painel neutro que remete à loja. */
export function GiftImage({ src, alt, category }: { src: string | null; alt: string; category: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-stone-soft/60 to-stone-soft">
        <span className="grid size-14 place-items-center rounded-full bg-card shadow-card ring-1 ring-line">
          <CategoryIcon slug={category} className="size-6 text-steel-dark" strokeWidth={1.4} />
        </span>
        <span className="text-xs font-medium tracking-wide text-muted">Veja as fotos na loja</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- site estático, imagem em /public
    <img
      src={publicPath(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-full object-contain p-5"
    />
  );
}
