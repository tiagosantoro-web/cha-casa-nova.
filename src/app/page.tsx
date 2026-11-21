import { HouseIcon } from "@/components/icons";
import { GiftRegistry } from "@/components/site/gift-registry";
import { Hero } from "@/components/site/hero";
import { ClosingInvite, Faq, HowItWorks } from "@/components/site/sections";
import { evento } from "@/data/evento";
import { fotosDosPresentes } from "@/lib/fotos";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <HowItWorks />
        <GiftRegistry fotos={fotosDosPresentes()} />
        <Faq />
        <ClosingInvite />
      </main>
      <footer className="bg-night text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="inline-flex items-center gap-2 font-display text-2xl">
              <HouseIcon className="size-6 text-glow" />
              {evento.casal}
            </p>
            <p className="mt-2 text-white/65">Obrigado por fazer parte deste novo começo.</p>
          </div>
          <a href="#presentes" className="inline-flex min-h-11 items-center text-sm font-semibold text-white/85 underline decoration-white/30 underline-offset-4 hover:text-white">
            Voltar para a lista de presentes
          </a>
        </div>
      </footer>
    </>
  );
}
