import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa6";
import ContactIcon from "../ContactIcon.jsx";
import { linkProps } from "../ContactLinks.jsx";
import Logo from "../Logo.jsx";
import SectionLink from "../SectionLink.jsx";
import { contacts } from "../../data/profile.js";
import { sections } from "../../data/sections.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { reducedMotion } from "../../motion/env.js";
import { activeSection, heroInView } from "../../motion/sections.js";
import { useStore } from "../../motion/store.js";

// GSAP só é baixado quando o menu vai ser usado (hover/foco no botão ou depois
// que a página fica ociosa), então não pesa no carregamento inicial.
let gsapLoad;
const loadGsap = () =>
  (gsapLoad ??= Promise.all([import("gsap"), import("gsap/CustomEase")]).then(
    ([{ gsap }, { CustomEase }]) => {
      gsap.registerPlugin(CustomEase);
      return {
        gsap,
        ease: CustomEase.create("kmenu", "0.65, 0.01, 0.05, 0.99"),
      };
    },
  ));
let gsap = null;
let EASE = "power3.inOut";

/*
 * Menu cinético (adaptado do "Sterling Gate Kinetic Navigation").
 *
 * Fixo no topo: logo à esquerda; idioma e o botão "Menu" à direita. O botão
 * abre um painel lateral que entra em três camadas (ciano, magenta e o fundo
 * escuro), com os links subindo de trás de uma máscara. Passar o mouse (ou o
 * foco) num link acende uma forma abstrata no fundo do painel.
 *
 * Tudo que anima é transform e opacidade. Esc, clique fora e clicar num link
 * fecham; enquanto aberto a página não rola e o resto do site fica inerte
 * para o teclado. Com "reduzir movimento", abre e fecha sem animação.
 */
export default function KineticMenu() {
  const { lang, setLang, t } = useLanguage();
  const { pathname } = useLocation();
  const home = pathname === "/";
  const active = useStore(activeSection);
  const heroVisible = useStore(heroInView);
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const button = useRef(null);
  const timeline = useRef(null);
  const mounted = useRef(false);

  // Abre / fecha: uma timeline por mudança; a anterior é interrompida onde estiver
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (!open) return;
    }
    let stale = false;
    loadGsap().then((m) => {
      if (stale) return;
      gsap = m.gsap;
      EASE = m.ease;
      animate();
    });
    return () => {
      stale = true;
    };

    function animate() {
      const q = gsap.utils.selector(root);
      const html = document.documentElement;
      timeline.current?.kill();

      const tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.7 } });
      if (open) {
        html.classList.add("menu-lock");
        tl.set(q(".kmenu"), { visibility: "visible" })
          .set(q(".kmenu__panel"), { xPercent: 0 })
          .to(q(".kmenu-btn__text > span"), { yPercent: -100, stagger: 0.08 })
          .to(q(".kmenu-btn__icon"), { rotate: 315 }, "<")
          .fromTo(q(".kmenu__overlay"), { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(
            q(".kmenu__layer"),
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.12, duration: 0.575 },
            "<",
          )
          .fromTo(
            q(".kmenu__link-inner"),
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            "<+=0.35",
          )
          .fromTo(
            q("[data-menu-fade]"),
            { autoAlpha: 0, yPercent: 50 },
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: 0.04,
              clearProps: "transform",
            },
            "<+=0.2",
          );
        // foco no primeiro link assim que o painel começa a entrar
        requestAnimationFrame(() =>
          q(".kmenu__link")[0]?.focus({ preventScroll: true }),
        );
      } else {
        html.classList.remove("menu-lock");
        tl.to(q(".kmenu__overlay"), { autoAlpha: 0 })
          .to(q(".kmenu__panel"), { xPercent: 120 }, "<")
          .to(q(".kmenu-btn__text > span"), { yPercent: 0 }, "<")
          .to(q(".kmenu-btn__icon"), { rotate: 0 }, "<")
          .set(q(".kmenu"), { visibility: "hidden" });
        if (
          root.current.querySelector(".kmenu")?.contains(document.activeElement)
        )
          button.current?.focus({ preventScroll: true });
      }
      if (reducedMotion.get()) tl.progress(1);
      timeline.current = tl;
    }
  }, [open]);

  // Esc fecha
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Pré-carrega o GSAP quando a página fica ociosa; desmontar solta a rolagem
  useEffect(() => {
    const id = window.requestIdleCallback
      ? requestIdleCallback(loadGsap, { timeout: 4000 })
      : setTimeout(loadGsap, 2000);
    return () =>
      window.cancelIdleCallback ? cancelIdleCallback(id) : clearTimeout(id);
  }, []);
  useEffect(
    () => () => document.documentElement.classList.remove("menu-lock"),
    [],
  );

  // Fechar ao clicar num link: a rolagem é liberada antes de o navegador seguir a âncora
  const close = () => {
    document.documentElement.classList.remove("menu-lock");
    setOpen(false);
  };

  // Forma do fundo ligada a cada link
  const showShape = (i) => {
    if (!gsap) return;
    const shapes = root.current.querySelectorAll(".kmenu__shape");
    shapes.forEach((s, j) => {
      const els = s.querySelectorAll(".kmenu__shape-el");
      if (j === i) {
        s.dataset.on = "";
        gsap.fromTo(
          els,
          { scale: 0.5, opacity: 0, rotate: -10, transformOrigin: "50% 50%" },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.7)",
            overwrite: "auto",
          },
        );
      } else if (s.dataset.on !== undefined) {
        gsap.to(els, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => delete s.dataset.on,
        });
      }
    });
  };
  const hideShapes = () => showShape(-1);

  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.get() ? "auto" : "smooth",
    });
  const email = contacts.find((c) => c.type === "email");

  return (
    <div ref={root}>
      <header className="kmenu-bar">
        <SectionLink
          id="inicio"
          aria-label={t.nav.home}
          className="kmenu-pill kmenu-pill--logo"
          onClick={close}
        >
          <Logo className="size-8 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-ember)_60%,transparent)]" />
          <span className="hidden text-[0.68rem] tracking-[0.3em] text-neutral-200 sm:inline">
            LUCAS
          </span>
        </SectionLink>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            aria-label={t.nav.language}
            className="kmenu-pill kmenu-pill--lang"
          >
            {/* key: a sigla nova sobe no lugar da antiga */}
            <span key={lang} className="swap-in">
              {lang === "pt" ? "PT" : "EN"}
            </span>
          </button>

          <button
            ref={button}
            type="button"
            onClick={() => setOpen((v) => !v)}
            onPointerEnter={loadGsap}
            onFocus={loadGsap}
            aria-expanded={open}
            aria-controls="menu-principal"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="kmenu-pill kmenu-btn"
            data-magnet
          >
            <span aria-hidden="true" className="kmenu-btn__text">
              <span>{t.nav.menuText}</span>
              <span>{t.nav.closeText}</span>
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="kmenu-btn__icon"
            >
              <path d="M7.33 16V0h1.34v16H7.33Z" />
              <path d="M16 8.67H0V7.33h16v1.34Z" />
              <path d="M6 7.33h1.33V6c0 .74-.6 1.33-1.33 1.33Z" />
              <path d="M10 7.33H8.67V6c0 .74.6 1.33 1.33 1.33Z" />
              <path d="M6 8.67h1.33V10c0-.74-.6-1.33-1.33-1.33Z" />
              <path d="M10 8.67H8.67V10c0-.74.6-1.33 1.33-1.33Z" />
            </svg>
          </button>
        </div>
      </header>

      <div id="menu-principal" className="kmenu" inert={!open}>
        <div className="kmenu__overlay" onClick={close} />
        <nav aria-label={t.nav.main} className="kmenu__panel">
          <div aria-hidden="true" className="kmenu__layer kmenu__layer--cyan" />
          <div
            aria-hidden="true"
            className="kmenu__layer kmenu__layer--magenta"
          />
          <div aria-hidden="true" className="kmenu__layer kmenu__layer--base">
            <Shapes />
          </div>

          <div className="kmenu__body">
            <ul className="kmenu__list" onPointerLeave={hideShapes}>
              {sections.map((s, i) => (
                <li key={s.id} className="kmenu__item">
                  <SectionLink
                    id={s.id}
                    onClick={close}
                    onPointerEnter={() => showShape(i % 5)}
                    onFocus={() => showShape(i % 5)}
                    onBlur={hideShapes}
                    aria-current={
                      home && active === s.id ? "location" : undefined
                    }
                    className="kmenu__link"
                  >
                    <span className="kmenu__link-inner">
                      <span aria-hidden="true" className="kmenu__num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {t.nav[s.key]}
                    </span>
                    <span aria-hidden="true" className="kmenu__hover" />
                  </SectionLink>
                </li>
              ))}
            </ul>

            <div className="kmenu__foot">
              <p
                data-menu-fade
                className="text-[0.62rem] tracking-[0.3em] text-neutral-400 uppercase"
              >
                {t.nav.talk}
              </p>
              {email && (
                <a data-menu-fade href={email.href} className="kmenu__mail">
                  {email.value}
                </a>
              )}
              <ul className="mt-5 flex gap-3">
                {contacts.map((c) => (
                  <li key={c.type} data-menu-fade>
                    <a
                      href={c.href}
                      {...linkProps(c)}
                      aria-label={c.label}
                      className="icon-tile"
                    >
                      <ContactIcon type={c.type} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Celular: depois da hero, atalho de volta ao topo */}
      <button
        type="button"
        onClick={toTop}
        aria-label={t.nav.top}
        tabIndex={home && !heroVisible ? 0 : -1}
        data-show={(home && !heroVisible && !open) || undefined}
        className="to-top fixed bottom-5 right-4 z-40 grid size-11 place-items-center rounded-full border border-white/15 bg-black/75 text-brand-400 shadow-[0_0_22px_-6px_var(--color-ember)] md:hidden"
      >
        <FaArrowUp aria-hidden="true" />
      </button>
    </div>
  );
}

// Formas abstratas do fundo do painel, uma por link (nas cores da marca)
const C = "var(--color-neon-cyan)";
const M = "var(--color-neon-magenta)";
function Shapes() {
  return (
    <div className="kmenu__shapes">
      <svg className="kmenu__shape" viewBox="0 0 400 400" fill="none">
        <circle
          className="kmenu__shape-el"
          cx="80"
          cy="120"
          r="40"
          fill={C}
          fillOpacity="0.14"
        />
        <circle
          className="kmenu__shape-el"
          cx="300"
          cy="80"
          r="60"
          fill={M}
          fillOpacity="0.12"
        />
        <circle
          className="kmenu__shape-el"
          cx="200"
          cy="300"
          r="80"
          fill={C}
          fillOpacity="0.08"
        />
        <circle
          className="kmenu__shape-el"
          cx="350"
          cy="280"
          r="30"
          fill={M}
          fillOpacity="0.14"
        />
      </svg>
      <svg className="kmenu__shape" viewBox="0 0 400 400" fill="none">
        <path
          className="kmenu__shape-el"
          d="M0 200 Q100 100, 200 200 T 400 200"
          stroke={C}
          strokeOpacity="0.16"
          strokeWidth="60"
        />
        <path
          className="kmenu__shape-el"
          d="M0 280 Q100 180, 200 280 T 400 280"
          stroke={M}
          strokeOpacity="0.13"
          strokeWidth="40"
        />
      </svg>
      <svg className="kmenu__shape" viewBox="0 0 400 400" fill="none">
        {[50, 150, 250, 350].flatMap((y, r) =>
          [0, 1, 2, 3].map((k) => (
            <circle
              key={`${r}-${k}`}
              className="kmenu__shape-el"
              cx={(r % 2 ? 100 : 50) + k * 100}
              cy={y}
              r={[8, 12, 10, 6][r]}
              fill={(r + k) % 2 ? M : C}
              fillOpacity="0.28"
            />
          )),
        )}
      </svg>
      <svg className="kmenu__shape" viewBox="0 0 400 400" fill="none">
        <path
          className="kmenu__shape-el"
          d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
          fill={C}
          fillOpacity="0.12"
        />
        <path
          className="kmenu__shape-el"
          d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
          fill={M}
          fillOpacity="0.1"
        />
      </svg>
      <svg className="kmenu__shape" viewBox="0 0 400 400" fill="none">
        <line
          className="kmenu__shape-el"
          x1="0"
          y1="100"
          x2="300"
          y2="400"
          stroke={C}
          strokeOpacity="0.14"
          strokeWidth="30"
        />
        <line
          className="kmenu__shape-el"
          x1="100"
          y1="0"
          x2="400"
          y2="300"
          stroke={M}
          strokeOpacity="0.12"
          strokeWidth="25"
        />
        <line
          className="kmenu__shape-el"
          x1="200"
          y1="0"
          x2="400"
          y2="200"
          stroke={C}
          strokeOpacity="0.1"
          strokeWidth="20"
        />
      </svg>
    </div>
  );
}
