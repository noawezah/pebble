"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CafeContent, Locale } from "@/lib/content";

const labels = {
  en: { nav: ["Our place", "The coffee", "Find us"], tag: "Specialty coffee · Bucharest", slow: "Good things take their time.", directions: "Get directions", scroll: "Take a little look", place: "A small place, your own pace", coffeeTitle: "Good coffee.\nGood company.", coffeeLabel: "Specialty coffee, by MERON", visit: "See you\nat PEBBLE.", visitNote: "A little off the beaten path. Right in the middle of things.", weekdays: "Monday – Friday", weekends: "Saturday – Sunday", address: "Find our little corner", hours: "Make time for coffee", social: "A little more PEBBLE", up: "Back to top", skip: "Skip to content", menu: "On the menu", currency: "lei", menuLabel: "Your next coffee", images: "Interior photograph enhanced with AI lighting.", alt: "PEBBLE’s intimate café: charcoal brick, leafy plants, left-hand counter and tall storefront windows", frontAlt: "PEBBLE’s glass entrance, with the original snail logo and warm interior", description: "PEBBLE specialty coffee in central Bucharest. MERON coffee, plants and a slower pace at Mendeleev 10." },
  ro: { nav: ["Locul nostru", "Cafeaua", "Găsește-ne"], tag: "Cafea de specialitate · București", slow: "Lucrurile bune cer timp.", directions: "Vezi traseul", scroll: "Aruncă o privire", place: "Un loc mic, un ritm al tău", coffeeTitle: "Cafea bună.\nOameni aproape.", coffeeLabel: "Cafea de specialitate, de la MERON", visit: "Ne vedem\nla PEBBLE.", visitNote: "Puțin departe de grabă. Chiar în mijlocul orașului.", weekdays: "Luni – Vineri", weekends: "Sâmbătă – Duminică", address: "Găsește colțul nostru", hours: "Fă-ți timp pentru cafea", social: "Mai mult PEBBLE", up: "Înapoi sus", skip: "Sari la conținut", menu: "În meniu", currency: "lei", menuLabel: "Următoarea ta cafea", images: "Fotografie a interiorului cu lumină îmbunătățită prin AI.", alt: "Cafeneaua intimă PEBBLE: cărămidă închisă, plante, bar în stânga și vitrină înaltă", frontAlt: "Intrarea din sticlă PEBBLE, cu marca originală a melcului și interiorul cald", description: "PEBBLE, cafea de specialitate în centrul Bucureștiului. Cafea MERON, plante și un ritm mai lent pe Mendeleev 10." },
};

export default function CafeSite({ content: c, locale: lang = "en" }: { content: CafeContent; locale?: Locale }) {
  const t = labels[lang];
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".cafe-reveal").forEach((el, i) => gsap.fromTo(el, {x:i%2?30:-30,y:42,rotation:i%2?2:-2,opacity:0},{x:0,y:0,rotation:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 96%",once:true}}));
        gsap.utils.toArray<HTMLElement>(".cafe-parallax").forEach(el => gsap.fromTo(el,{yPercent:-4,scale:1.13},{yPercent:4,ease:"none",scrollTrigger:{trigger:el.parentElement,start:"top bottom",end:"bottom top",scrub:.8}}));
        gsap.fromTo(".cafe-snail",{rotation:-8,y:12},{rotation:5,y:-12,ease:"none",scrollTrigger:{trigger:".cafe-story",start:"top bottom",end:"bottom top",scrub:1}});
      },root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [lang]);

  return <div className="cafe" ref={root} id="top">
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="header page-pad cafe-header">
      <Link href={lang === "en" ? "/" : "/ro"} className="small-brand" aria-label="PEBBLE home">PEBBLE</Link>
      <nav aria-label={lang === "en" ? "Main navigation" : "Navigare principală"}>{["our-place","coffee","visit"].map((id,i)=><a href={`#${id}`} key={id}>{t.nav[i]}</a>)}</nav>
      <div className="language"><Link href="/" hrefLang="en" lang="en" aria-current={lang === "en" ? "page" : undefined}>EN</Link><span>/</span><Link href="/ro" hrefLang="ro" lang="ro" aria-current={lang === "ro" ? "page" : undefined}>RO</Link></div>
    </header>
    <main id="main">
      <section className="cafe-hero page-pad" aria-labelledby="cafe-title">
        <div className="cafe-hero-meta eyebrow"><span>{t.tag}</span><a href="#visit">Mendeleev 10 <i className="ri-arrow-right-down-line" aria-hidden="true"/></a></div>
        <div className="cafe-big-name" aria-hidden="true">PEBBLE</div>
        <div className="cafe-hero-composition">
          <div className="cafe-main-photo"><Image className="cafe-parallax" src="/images/interior-morning.webp" alt={t.alt} fill priority sizes="(max-width:700px) 100vw, 72vw"/></div>
          <h1 id="cafe-title" className="cafe-title cafe-reveal">{c.heroTitle[lang].split("\n").map((line,i)=><span key={i}>{line}</span>)}</h1>
          <div className="cafe-hero-aside"><p>{c.heroText[lang]}</p><a className="button primary" href={c.maps} target="_blank" rel="noreferrer">{t.nav[2]}<i className="ri-arrow-right-up-line" aria-hidden="true"/></a></div>
          <a className="cafe-scroll eyebrow" href="#our-place">{t.scroll}<i className="ri-arrow-down-line" aria-hidden="true"/></a>
          <span className="cafe-photo-side eyebrow">A little PEBBLE in Bucharest</span>
        </div>
      </section>
      <section id="our-place" className="cafe-story page-pad section-space">
        <div className="section-label eyebrow"><span>01 / {t.place}</span><span>PEBBLE, BUCHAREST</span></div>
        <div className="seven-grid"><h2 className="cafe-section-title cafe-reveal">{c.storyTitle[lang]}</h2><div className="cafe-story-copy"><p>{c.storyText[lang]}</p><div className="cafe-snail"><Image src="/images/snail.svg" alt="" width={250} height={312}/></div><p className="cafe-snail-caption">{t.slow}</p></div></div>
        <div className="cafe-wall-composition"><figure className="cafe-wall-photo cafe-reveal"><Image src="/images/snail-wall.webp" alt={lang === "en" ? "White ceramic snails on a lush moss wall, inspired by PEBBLE’s wall installation" : "Melci din ceramică albă pe un perete cu mușchi verde, inspirați de instalația PEBBLE"} width={1536} height={1024} sizes="(max-width:700px) 90vw, 58vw"/></figure><p className="cafe-wall-note cafe-reveal">{lang === "en" ? <>A little<br/>slower.</> : <>Un pic<br/>mai încet.</>}</p></div>
      </section>
      <section id="coffee" className="cafe-coffee page-pad section-space">
        <div className="section-label eyebrow"><span>02 / {t.nav[1]}</span><span>PEBBLE × MERON</span></div>
        <div className="seven-grid"><div className="cafe-coffee-copy"><span className="eyebrow">{t.coffeeLabel}</span><h2 className="cafe-section-title cafe-reveal">{t.coffeeTitle}</h2><p>{c.coffeeText[lang]}</p></div><div className="cafe-coffee-photo cafe-reveal"><Image src="/images/flat-white-seahorse.webp" className="cafe-parallax" alt={lang === "en" ? "A white ceramic flat white with intricate seahorse latte art on PEBBLE’s ivory counter" : "Flat white într-o ceașcă albă, cu un căluț de mare desenat în spuma de lapte"} fill sizes="(max-width:700px) 100vw, 45vw"/></div></div>
        <figure className="cafe-machine-photo cafe-reveal"><Image src="/images/marzocco-bar.webp" alt={lang === "en" ? "La Marzocco espresso machine, black grinders and PEBBLE’s ivory bar in morning light" : "Espressorul La Marzocco, râșnițele negre și barul PEBBLE în lumina dimineții"} width={1536} height={1024} sizes="(max-width:700px) 90vw, 65vw"/><figcaption className="eyebrow">PEBBLE / {lang === "en" ? "Behind the coffee" : "În spatele cafelei"}</figcaption></figure>
        <div className="cafe-coffee-bottom"><span>MERON</span><span className="eyebrow">{t.slow}</span></div>
      </section>
      {c.menu.length > 0 && <section id="menu" className="cafe-menu page-pad section-space"><div className="section-label eyebrow"><span>{t.menuLabel}</span><span>PEBBLE / MERON</span></div><h2 className="cafe-section-title cafe-reveal">{t.menu}</h2><dl>{c.menu.map(item=><div key={item._key}><dt>{item.name[lang]}{item.description?.[lang] && <p>{item.description[lang]}</p>}</dt><dd>{new Intl.NumberFormat(lang === "en" ? "en-GB" : "ro-RO",{maximumFractionDigits:2}).format(item.price)} {t.currency}</dd></div>)}</dl></section>}
      <section id="visit" className="cafe-visit page-pad section-space">
        <div className="section-label eyebrow"><span>03 / {t.nav[2]}</span><span>Mendeleev 10</span></div>
        <div className="cafe-visit-grid"><div className="cafe-front-photo cafe-reveal"><Image src="/images/front-reference.png" alt={t.frontAlt} width={555} height={725} sizes="(max-width:700px) 85vw, 40vw"/></div><div className="cafe-visit-copy"><h2 className="cafe-section-title cafe-reveal">{t.visit}</h2><p>{t.visitNote}</p><div className="visit-address"><h3 className="eyebrow">{t.address}</h3><address>{c.address}<br/>{c.postalCode} {lang === "en" ? "Bucharest" : "București"}</address><a className="text-link" href={c.maps} target="_blank" rel="noreferrer">{t.directions}<i className="ri-arrow-right-up-line" aria-hidden="true"/></a></div><div className="visit-hours"><h3 className="eyebrow">{t.hours}</h3><dl><div><dt>{t.weekdays}</dt><dd>{c.weekdayHours}</dd></div><div><dt>{t.weekends}</dt><dd>{c.weekendHours}</dd></div></dl></div></div></div>
      </section>
    </main>
    <footer className="footer page-pad cafe-footer"><div className="cafe-footer-top"><p>{t.social}</p><div><a href={c.instagram} target="_blank" rel="noreferrer">Instagram<i className="ri-instagram-line" aria-hidden="true"/></a><a href={c.facebook} target="_blank" rel="noreferrer">Facebook<i className="ri-arrow-right-up-line" aria-hidden="true"/></a></div></div><div className="footer-wordmark" aria-hidden="true">PEBBLE</div><div className="footer-bottom eyebrow"><span>© {new Date().getFullYear()} PEBBLE · {t.tag}</span><a href="#top">{t.up}<i className="ri-arrow-up-line" aria-hidden="true"/></a></div></footer>
  </div>;
}
