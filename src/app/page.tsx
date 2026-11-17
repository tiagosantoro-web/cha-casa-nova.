import { HouseIcon } from "@/components/icons";
import { GiftRegistry } from "@/components/site/gift-registry";
import { Hero } from "@/components/site/hero";
import { Faq, HowItWorks } from "@/components/site/sections";
import { evento } from "@/data/evento";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <HowItWorks />
        <GiftRegistry />
        <Faq />
      </main>
      <footer className="border-t border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="inline-flex items-center gap-2 font-display text-2xl">
              <HouseIcon className="size-6" />
              {evento.casal}
            </p>
            <p className="mt-2 text-paper/70">Obrigado por fazer parte deste novo começo.</p>
          </div>
          <a href="#presentes" className="text-sm font-semibold underline underline-offset-4">
            Voltar para a lista de presentes
          </a>
        </div>
      </footer>
    </>
  );
}
