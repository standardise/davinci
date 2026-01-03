import {
  Features,
  Footer,
  Hero,
  Pricing,
  UseCases,
} from "@/features/site/index";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <main>
        <Hero />
        <Features />
        <Pricing />
        <UseCases />
        <Footer />
      </main>
    </div>
  );
}
