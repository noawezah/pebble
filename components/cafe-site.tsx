"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CafeContent, Locale } from "@/lib/content";
import SnailSculpture from "@/components/snail-sculpture";
import LoadingIntro from "@/components/loading-intro";
import { usePhotoContrast } from "@/components/use-photo-contrast";
import Brand from "@/components/brand";
import { MotionLink } from "@/components/motion-action";

const labels = {
  en: {
    nav: ["Our place", "The coffee", "Find us"],
    tag: "Specialty coffee · Bucharest",
    slow: "Good things take their time.",
    directions: "Get directions",
    scroll: "Take a little look",
    place: "A small place, your own pace",
    coffeeTitle: "Good coffee.\nGood company.",
    coffeeLabel: "Specialty coffee, by MERON",
    visit: "See you\nat PEBBLE.",
    visitNote: "A little off the beaten path. Right in the middle of things.",
    weekdays: "Monday – Friday",
    weekends: "Saturday – Sunday",
    address: "Find our little corner",
    hours: "Make time for coffee",
    social: "A little more PEBBLE",
    up: "Back to top",
    skip: "Skip to content",
    menu: "On the menu",
    currency: "lei",
    menuLabel: "Your next coffee",
    images: "Interior photograph enhanced with AI lighting.",
    alt: "PEBBLE’s intimate café: charcoal brick, leafy plants, left-hand counter and tall storefront windows",
    frontAlt:
      "PEBBLE’s glass entrance, with the original snail logo and warm interior",
    description:
      "PEBBLE specialty coffee in central Bucharest. MERON coffee, plants and a welcoming atmosphere at Mendeleev 10.",
  },
  ro: {
    nav: ["Locul nostru", "Cafeaua", "Găsește-ne"],
    tag: "Cafea de specialitate · București",
    slow: "Lucrurile bune cer timp.",
    directions: "Vezi traseul",
    scroll: "Aruncă o privire",
    place: "Un loc mic, un ritm al tău",
    coffeeTitle: "Cafea bună.\nOameni aproape.",
    coffeeLabel: "Cafea de specialitate, de la MERON",
    visit: "Ne vedem\nla PEBBLE.",
    visitNote: "Puțin departe de grabă. Chiar în mijlocul orașului.",
    weekdays: "Luni – Vineri",
    weekends: "Sâmbătă – Duminică",
    address: "Găsește colțul nostru",
    hours: "Fă-ți timp pentru cafea",
    social: "Mai mult PEBBLE",
    up: "Înapoi sus",
    skip: "Sari la conținut",
    menu: "În meniu",
    currency: "lei",
    menuLabel: "Următoarea ta cafea",
    images: "Fotografie a interiorului cu lumină îmbunătățită prin AI.",
    alt: "Cafeneaua intimă PEBBLE: cărămidă închisă, plante, bar în stânga și vitrină înaltă",
    frontAlt:
      "Intrarea din sticlă PEBBLE, cu marca originală a melcului și interiorul cald",
    description:
      "PEBBLE, cafea de specialitate în centrul Bucureștiului. Cafea MERON, plante și o atmosferă primitoare pe Mendeleev 10.",
  },
};

export default function CafeSite({
  content: c,
  locale: lang = "en",
}: {
  content: CafeContent;
  locale?: Locale;
}) {
  const t = labels[lang];
  const root = useRef<HTMLDivElement>(null);
  usePhotoContrast(root);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 700px)",
        desktop: "(min-width: 701px)",
      },
      (match) => {
        if (!match.conditions?.motion) return;
        const context = gsap.context(() => {
          const mobile = !!match.conditions?.mobile;
          const drift = mobile
            ? 10
            : Math.min(48, (root.current?.clientWidth || 1200) * 0.03);
          // A vertical journey with alternating diagonal camera positions.
          gsap.utils.toArray<HTMLElement>(".cafe-zigzag").forEach((el) => {
            if (!mobile && el.classList.contains("cafe-main-photo")) return;
            const direction = Number(el.dataset.direction) || 1;
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.1,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(
                el,
                {
                  x: -direction * drift,
                  y: mobile ? 22 : 60,
                  rotation: -direction * (mobile ? 1 : 3.5),
                },
                {
                  x: direction * drift * 0.25,
                  y: 0,
                  rotation: direction * 0.5,
                  duration: 0.55,
                  ease: "none",
                },
              )
              .to(el, {
                x: direction * drift,
                y: mobile ? -18 : -45,
                rotation: direction * (mobile ? 1 : 2.5),
                duration: 0.45,
                ease: "none",
              });
          });
          gsap.utils.toArray<HTMLElement>(".cafe-parallax").forEach((el) => {
            const hero = !mobile && el.parentElement?.classList.contains("cafe-main-photo");
            gsap.fromTo(
              el,
              { yPercent: hero ? -3 : -5, xPercent: hero ? 0 : -2, scale: hero ? 1.08 : 1.17 },
              {
                yPercent: hero ? 3 : 5,
                xPercent: hero ? 0 : 2,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          });
          gsap.utils
            .toArray<HTMLElement>(".cafe-section-title")
            .forEach((el, i) => {
              gsap.fromTo(
                el,
                { x: i % 2 ? 18 : -18, y: 30, rotation: i % 2 ? 3 : -3 },
                {
                  x: 0,
                  y: 0,
                  rotation: 0,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 96%",
                    end: "top 40%",
                    scrub: 0.7,
                  },
                },
              );
            });
          gsap.utils
            .toArray<HTMLElement>(".cafe-text-orbit")
            .forEach((el, i) => {
              const direction = i % 2 ? 1 : -1;
              const diagonal = el.classList.contains("cafe-cascade-title");
              gsap.fromTo(
                el,
                {
                  x: direction * (mobile ? 8 : 35),
                  y: 25,
                  rotation: diagonal ? -31 : -direction * 6,
                },
                {
                  x: -direction * (mobile ? 8 : 35),
                  y: -25,
                  rotation: diagonal ? -22 : direction * 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: el.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                },
              );
            });
          gsap.fromTo(
            ".cafe-title span:last-child",
            { x: mobile ? 0 : -18, rotation: -2 },
            {
              x: mobile ? 0 : 18,
              rotation: 2,
              ease: "none",
              scrollTrigger: {
                trigger: ".cafe-hero-composition",
                start: "top 80%",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }, root);
        return () => context.revert();
      },
    );
    return () => media.revert();
  }, [lang]);

  return (
    <>
    <LoadingIntro locale={lang} />
    <div className="cafe" ref={root} id="top">
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="header page-pad cafe-header">
        <Link
          href={lang === "en" ? "/" : "/ro"}
          className="small-brand"
          aria-label="PEBBLE home"
        >
          <Brand />
        </Link>
        <nav
          aria-label={lang === "en" ? "Main navigation" : "Navigare principală"}
        >
          {["our-place", "coffee", "visit"].map((id, i) => (
            <a href={`#${id}`} key={id}>
              <span className="nav-roll">
                <span>{t.nav[i]}</span>
                <span aria-hidden="true">{t.nav[i]}</span>
              </span>
            </a>
          ))}
        </nav>
        <div className="language">
          <Link
            href="/"
            hrefLang="en"
            lang="en"
            aria-current={lang === "en" ? "page" : undefined}
          >
            EN
          </Link>
          <span>/</span>
          <Link
            href="/ro"
            hrefLang="ro"
            lang="ro"
            aria-current={lang === "ro" ? "page" : undefined}
          >
            RO
          </Link>
        </div>
      </header>
      <main id="main">
        <section className="cafe-hero page-pad" aria-labelledby="cafe-title">
          <div className="cafe-hero-meta eyebrow">
            <span>{t.tag}</span>
            <a href="#visit">
              Mendeleev 10{" "}
              <i className="ri-arrow-right-down-line" aria-hidden="true" />
            </a>
          </div>
          <div className="cafe-big-name" aria-hidden="true">
            PEBBLE
          </div>
          <div className="cafe-hero-composition">
            <div className="cafe-main-photo cafe-zigzag" data-direction="1">
              <Image
                className="cafe-parallax"
                src="/images/interior-empty-editorial.webp"
                alt={t.alt}
                fill
                preload
                sizes="(max-width:700px) 100vw, 72vw"
              />
            </div>
            <h1 id="cafe-title" className="cafe-title cafe-reveal">
              {c.heroTitle[lang].split("\n").map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h1>
            <div className="cafe-hero-aside">
              <p>{c.heroText[lang]}</p>
            </div>
            <a className="cafe-scroll eyebrow" href="#our-place">
              {t.scroll}
              <i className="ri-arrow-down-line" aria-hidden="true" />
            </a>
            <span className="cafe-photo-side eyebrow">
              A little PEBBLE in Bucharest
            </span>
          </div>
        </section>
        <section id="our-place" className="cafe-story page-pad section-space">
          <div className="section-label eyebrow">
            <span>01 / {t.place}</span>
            <span>PEBBLE, BUCHAREST</span>
          </div>
          <div className="seven-grid">
            <h2 className="cafe-section-title cafe-reveal">
              {c.storyTitle[lang]}
            </h2>
            <div className="cafe-story-copy">
              <p>{c.storyText[lang]}</p>
              <a
                className="cafe-guide-link"
                href="https://europeancoffeetrip.com/cafe/pebble-bucharest/"
                target="_blank"
                rel="noreferrer"
              >
                {lang === "en"
                  ? "Find us on European Coffee Trip"
                  : "Ne găsești pe European Coffee Trip"}
                <i className="ri-arrow-right-up-line" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="cafe-wall-composition">
            <figure className="cafe-wall-photo cafe-zigzag" data-direction="-1">
              <Image
                src="/images/snail-wall-editorial.webp"
                alt={
                  lang === "en"
                    ? "White ceramic snails on a lush moss wall, inspired by PEBBLE’s wall installation"
                    : "Melci din ceramică albă pe un perete cu mușchi verde, inspirați de instalația PEBBLE"
                }
                width={1536}
                height={1024}
                sizes="(max-width:700px) 90vw, 58vw"
              />
            </figure>
            <div className="cafe-corner-photo"><SnailSculpture /></div>
            <div className="cafe-wall-right">
              <p className="cafe-wall-note cafe-text-orbit">
                {lang === "en" ? (
                  <>
                    A little
                    <br />
                    slower.
                  </>
                ) : (
                  <>
                    Un pic
                    <br />
                    mai încet.
                  </>
                )}
              </p>
            <figure
              className="cafe-meron-photo cafe-zigzag"
              data-direction="1"
            >
              <div className="cafe-image-crop">
                <Image
                  className="cafe-parallax"
                  src="/images/meron-corner-reference-editorial.webp"
                  alt={
                    lang === "en"
                      ? "MERON coffee sign on the PEBBLE counter with the moss wall and window beyond"
                      : "Semnul MERON pe barul PEBBLE, cu peretele de mușchi și fereastra în fundal"
                  }
                  width={857}
                  height={729}
                  sizes="(max-width:700px) 75vw, 36vw"
                />
              </div>
            </figure>

            </div>
            <figure
              className="cafe-cascade-photo"
              data-direction="1"
            >
              <div className="cafe-image-crop cafe-zigzag" data-direction="1">
                <Image
                  className="cafe-parallax"
                  src="/images/interior-empty-editorial.webp"
                  alt={
                    lang === "en"
                      ? "Sunlit seating and leafy plants inside PEBBLE"
                      : "Locuri la fereastră și plante în interiorul PEBBLE"
                  }
                  width={1478}
                  height={1064}
                  sizes="(max-width:700px) 90vw, 56vw"
                />
              </div>
            </figure>
              <p className="cafe-cascade-title cafe-text-orbit">
                {lang === "en"
                  ? <>A little light.<br />A lovely place to be.</>
                  : <>Puțină lumină.<br />Un loc în care te simți bine.</>}
              </p>

          </div>
        </section>
        <section id="coffee" className="cafe-coffee page-pad section-space">
          <div className="section-label eyebrow">
            <span>02 / {t.nav[1]}</span>
            <span>PEBBLE × MERON</span>
          </div>
          <div className="seven-grid">
            <div className="cafe-coffee-copy">
              <span className="eyebrow">{t.coffeeLabel}</span>
              <h2 className="cafe-section-title cafe-reveal">
                {t.coffeeTitle}
              </h2>
              <p>{c.coffeeText[lang]}</p>
            </div>
            <div className="cafe-coffee-photo cafe-zigzag" data-direction="1">
              <Image
                src="/images/seahorse-real-editorial.webp"
                className="cafe-parallax"
                alt={
                  lang === "en"
                    ? "A dark PEBBLE ceramic cup with seahorse latte art on the café’s ivory counter"
                    : "Flat white într-o ceașcă închisă PEBBLE, cu un căluț de mare desenat în spuma de lapte"
                }
                fill
                sizes="(max-width:700px) 100vw, 45vw"
              />
            </div>
          </div>
          <figure className="cafe-bunny-photo cafe-zigzag" data-direction="-1">
            <div className="cafe-image-crop">
              <Image
                className="cafe-parallax"
                src="/images/bunny-tray-editorial.webp"
                alt={
                  lang === "en"
                    ? "Bunny latte art in a rounded PEBBLE ceramic cup, with a water cup on a dark tray"
                    : "Latte art cu iepuraș într-o ceașcă PEBBLE, alături de apă pe o tavă închisă"
                }
                width={1479}
                height={1063}
                sizes="(max-width:700px) 90vw, 52vw"
              />
            </div>
            <figcaption className="eyebrow">
              {lang === "en"
                ? "A little joy in every cup."
                : "Puțină bucurie în fiecare ceașcă."}
            </figcaption>
          </figure>
          <figure
            className="cafe-machine-photo cafe-zigzag"
            data-direction="-1"
          >
            <Image
              src="/images/marzocco-bar-editorial.webp"
              alt={
                lang === "en"
                  ? "La Marzocco espresso machine, black grinders and PEBBLE’s ivory bar in morning light"
                  : "Espressorul La Marzocco, râșnițele negre și barul PEBBLE în lumina dimineții"
              }
              width={1536}
              height={1024}
              sizes="(max-width:700px) 90vw, 65vw"
            />
            <figcaption className="eyebrow">
              PEBBLE /{" "}
              {lang === "en" ? "Behind the coffee" : "În spatele cafelei"}
            </figcaption>
            <span className="cafe-machine-overlay cafe-text-orbit">
              {lang === "en" ? (
                <>
                  One
                  <br />
                  good cup.
                </>
              ) : (
                <>
                  O cafea.
                  <br />
                  Pe îndelete.
                </>
              )}
            </span>
          </figure>
          <figure className="cafe-bar-detail cafe-zigzag" data-direction="1">
            <div className="cafe-image-crop">
              <Image
                className="cafe-parallax"
                src="/images/reverse-bar-editorial.webp"
                alt={
                  lang === "en"
                    ? "PEBBLE’s white brick bar, illuminated MERON coffee shelves and pastry display"
                    : "Barul PEBBLE cu cărămidă albă, rafturi cu cafea MERON și vitrină cu gustări"
                }
                width={1536}
                height={1024}
                sizes="(max-width:700px) 90vw, 55vw"
              />
            </div>
            <figcaption className="eyebrow">
              {lang === "en"
                ? "From the roastery. To our bar. To your cup."
                : "De la prăjitorie. La barul nostru. În ceașca ta."}
            </figcaption>
          </figure>
          <div className="cafe-coffee-bottom">
            <span>MERON</span>
            <span className="eyebrow">{t.slow}</span>
          </div>
        </section>
        {c.menu.length > 0 && (
          <section id="menu" className="cafe-menu page-pad section-space">
            <div className="section-label eyebrow">
              <span>{t.menuLabel}</span>
              <span>PEBBLE / MERON</span>
            </div>
            <h2 className="cafe-section-title cafe-reveal">{t.menu}</h2>
            <dl>
              {c.menu.map((item) => (
                <div key={item._key}>
                  <dt>
                    {item.name[lang]}
                    {item.description?.[lang] && (
                      <p>{item.description[lang]}</p>
                    )}
                  </dt>
                  <dd>
                    {new Intl.NumberFormat(lang === "en" ? "en-GB" : "ro-RO", {
                      maximumFractionDigits: 2,
                    }).format(item.price)}{" "}
                    {t.currency}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <section
          id="at-the-counter"
          className="cafe-retail page-pad section-space"
        >
          <div className="section-label eyebrow">
            <span>03 / {lang === "en" ? "At the counter" : "La bar"}</span>
            <span>
              {lang === "en"
                ? "PEBBLE / TAKE A LITTLE HOME"
                : "PEBBLE / IA PUȚIN ACASĂ"}
            </span>
          </div>
          <div className="seven-grid">
            <div className="cafe-retail-copy">
              <h2 className="cafe-section-title">
                {lang === "en"
                  ? "For here.\nFor later."
                  : "Pentru aici.\nPentru acasă."}
              </h2>
              <p>{c.retailText[lang]}</p>
              <ul className="retail-list">
                <li>Zăganu / Grivița</li>
                <li>{lang === "en" ? "PEBBLE mugs" : "Căni PEBBLE"}</li>
                <li>{lang === "en" ? "Snacks to go" : "Gustări la pachet"}</li>
              </ul>
            </div>
            <figure
              className="cafe-retail-photo cafe-zigzag"
              data-direction="-1"
            >
              <div className="cafe-image-crop">
                <Image
                  className="cafe-parallax"
                  src="/images/fridge-merch-editorial.webp"
                  alt={
                    lang === "en"
                      ? "Local beers in the fridge, snacks and dark ceramic PEBBLE cups on the adjacent shelf"
                      : "Bere locală la frigider, gustări și căni PEBBLE pe raftul alăturat"
                  }
                  width={1024}
                  height={1280}
                  sizes="(max-width:700px) 85vw, 55vw"
                />
              </div>
            </figure>
          </div>
        </section>
        <section
          className="cafe-reviews page-pad section-space"
          aria-labelledby="reviews-title"
        >
          <div className="section-label eyebrow">
            <span>
              04 / {lang === "en" ? "A little love" : "Cu drag, de la voi"}
            </span>
            <span>GOOGLE REVIEWS</span>
          </div>
          <div className="seven-grid">
            <div className="cafe-rating">
              <span className="rating-number">5.0</span>
              <span
                className="rating-stars"
                aria-label={
                  lang === "en" ? "5 out of 5 stars" : "5 din 5 stele"
                }
              >
                ★★★★★
              </span>
              <p>
                {lang === "en"
                  ? "Average rating on Google"
                  : "Nota medie pe Google"}
              </p>
            </div>
            <div className="cafe-review-copy">
              <h2 id="reviews-title" className="cafe-section-title">
                {lang === "en"
                  ? "Small café.\nSo much love."
                  : "Un loc mic.\nAtât de iubit."}
              </h2>
              <p>
                {lang === "en"
                  ? "Every visit, every kind word, every familiar face. Thank you for making our little corner of Bucharest feel so special."
                  : "Fiecare vizită, fiecare vorbă bună, fiecare chip cunoscut. Vă mulțumim că faceți micul nostru colț din București atât de special."}
              </p>
              <MotionLink href={c.maps} className="outline" external>
                {lang === "en"
                  ? "Read our Google reviews"
                  : "Citește recenziile Google"}
              </MotionLink>
            </div>
          </div>
        </section>
        <section id="visit" className="cafe-visit page-pad section-space">
          <div className="section-label eyebrow">
            <span>05 / {t.nav[2]}</span>
            <span>Mendeleev 10</span>
          </div>
          <div className="cafe-visit-grid">
            <div className="cafe-front-photo cafe-zigzag" data-direction="1">
              <Image
                src="/images/front-enhanced-editorial.webp"
                alt={t.frontAlt}
                width={555}
                height={725}
                sizes="(max-width:700px) 85vw, 40vw"
              />
            </div>
            <div className="cafe-visit-copy">
              <h2 className="cafe-section-title cafe-reveal">{t.visit}</h2>
              <p>{t.visitNote}</p>
              <div className="visit-address">
                <h3 className="eyebrow">{t.address}</h3>
                <address>
                  {c.address}
                  <br />
                  {c.postalCode} {lang === "en" ? "Bucharest" : "București"}
                </address>
                <MotionLink href={c.maps} className="outline" external>
                  {t.directions}
                </MotionLink>
              </div>
              <div className="visit-hours">
                <h3 className="eyebrow">{t.hours}</h3>
                <dl>
                  <div>
                    <dt>{t.weekdays}</dt>
                    <dd>{c.weekdayHours}</dd>
                  </div>
                  <div>
                    <dt>{t.weekends}</dt>
                    <dd>{c.weekendHours}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="cafe-visit-details">
            <div className="cafe-services">
              <p>
                {lang === "en"
                  ? "Dog friendly · Plant-based options · A few seats outside"
                  : "Căței bineveniți · Opțiuni vegetale · Câteva locuri pe terasă"}
              </p>
            </div>
            <iframe
              className="cafe-map"
              title={
                lang === "en"
                  ? "PEBBLE on Google Maps — Mendeleev 10, Bucharest"
                  : "PEBBLE pe Google Maps — Mendeleev 10, București"
              }
              src="https://maps.google.com/maps?q=Pebble%20Bucharest%20Mendeleev%2010&t=&z=17&ie=UTF8&iwloc=B&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </main>
      <footer className="footer page-pad cafe-footer">
        <div className="cafe-footer-top">
          <p>{t.social}</p>
          <div>
            <a href={c.instagram} target="_blank" rel="noreferrer">
              Instagram
              <i className="ri-instagram-line" aria-hidden="true" />
            </a>
            <a href={c.facebook} target="_blank" rel="noreferrer">
              Facebook
              <i className="ri-facebook-circle-fill" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          PEBBLE
        </div>
        <div className="footer-bottom eyebrow">
          <span>
            © {new Date().getFullYear()} PEBBLE · {t.tag}
          </span>
          <a href="#top">
            {t.up}
            <i className="ri-arrow-up-line" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
    </>
  );
}
