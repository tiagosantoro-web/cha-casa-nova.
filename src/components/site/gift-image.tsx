"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/icons";
import { publicPath } from "@/lib/paths";

/** Foto do anúncio; sem foto (ou se ela falhar), mostra só o ícone da categoria. */
export function GiftImage({ src, alt, category }: { src: string | null; alt: string; category: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grid size-full place-items-center bg-stone-soft">
        <CategoryIcon slug={category} className="size-12 text-steel-dark" strokeWidth={1.1} />
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
