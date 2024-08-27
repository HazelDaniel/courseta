import type { MetaFunction } from "@remix-run/node";
import { Faq } from "~/components/faq";
import { Header } from "~/components/header";
import { HeroCarousel } from "~/components/hero-carousel";
import { PlatformPreviewArea } from "~/components/platform-preview-area";
import HeroStyles from "~/styles/hero.module.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | Courseta" },
    {
      name: "description",
      content: "landing page of the courseta edtech platform",
    },
  ];
};

const Hero: React.FC = () => {
  return (
    <section id={"hero"} className={HeroStyles["hero_styled"]}>
      <div className={HeroStyles["hero_left"]}>
        <div className={HeroStyles["hero_lt"]}>
          <span>Game changing ed-tech platform</span>
        </div>
        <div className={HeroStyles["hero_lb"]}>
          <h2>transform your learning journey today</h2>
        </div>
      </div>
      <div className={HeroStyles["hero_right"]}>
        <img
          src="/illustrations/student_illustration_hero_img.png"
          alt="illustration image representing a learning student on the platform's hero section. hero image"
        />
      </div>
      <img
        src="/images/net_wave_hero_img.png"
        alt="hero background image, spiral grid"
        className={HeroStyles["hero_bg"]}
      />
    </section>
  );
};

export default function Index() {
  return (
    <>
      <Header />
      <Hero />
      <HeroCarousel />
      <PlatformPreviewArea />
      <Faq />
    </>
  );
}
