import Hero from "@/components/Hero";
import LandingSections from "@/components/LandingSections";

export default function Page() {
  return (
    <>
      <section id="home" className="home-hero">
        <Hero />
      </section>
      <LandingSections />
    </>
  );
}
