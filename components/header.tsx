"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================================
   CONFIG
========================================================= */

const FRAME_COUNT = 200;
const SCROLL_HEIGHT = "500vh";

const INITIAL_PRELOAD = 24;
const PRELOAD_BATCH_SIZE = 24;

const ACCENT = "#7CB2A9";

const navigation = [
  { label: "Technology", href: "#technology" },
  { label: "About", href: "#about" },
  { label: "Circularity", href: "#circularity" },
  { label: "Contact", href: "#contact" },
];

type Story = {
  number: string;
  label: string;
  lines: string[];
  description: string;
  align: "left" | "right";
  enterStart: number;
  exitStart?: number;
};

const STORIES: Story[] = [
  {
    number: "01",
    label: "MATERIALS",
    lines: ["It starts with", "matter."],
    description:
      "Recovering critical materials and returning their value to the energy cycle.",
    align: "left",
    enterStart: 0,
    exitStart: 0.19,
  },
  {
    number: "02",
    label: "CELLS",
    lines: ["Matter becomes", "energy."],
    description:
      "Advanced cells engineered for greater density, longer life and fewer wasted resources.",
    align: "right",
    enterStart: 0.265,
    exitStart: 0.385,
  },
  {
    number: "03",
    label: "SYSTEMS",
    lines: ["Energy becomes", "a system."],
    description:
      "Cells connect into intelligent battery architecture designed to perform as one.",
    align: "left",
    enterStart: 0.425,
    exitStart: 0.555,
  },
  {
    number: "04",
    label: "MOBILITY",
    lines: ["Power becomes", "motion."],
    description:
      "High-density energy systems built for the next generation of electric mobility.",
    align: "right",
    enterStart: 0.605,
    exitStart: 0.775,
  },
  {
    number: "05",
    label: "CIRCULARITY",
    lines: ["Motion comes", "full circle."],
    description:
      "When one journey ends, valuable materials return to begin the next.",
    align: "left",
    enterStart: 0.86,
  },
];

/* =========================================================
   FRAME PATH
========================================================= */

function getFrameSrc(index: number) {
  const number = String(index + 1).padStart(4, "0");

  return `/frames/frame_${number}.webp`;
}

/* =========================================================
   SPLIT TEXT
========================================================= */

function SplitLine({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wordIndex, words) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-block whitespace-nowrap"
        >
          {Array.from(word).map((letter, letterIndex) => (
            <span
              key={`${letter}-${letterIndex}`}
              className="cira-letter inline-block will-change-[transform,opacity,filter,color]"
              aria-hidden="true"
            >
              {letter}
            </span>
          ))}

          {wordIndex < words.length - 1 && (
            <span className="inline-block w-[0.27em]" aria-hidden="true">
              &nbsp;
            </span>
          )}
        </span>
      ))}

      <span className="sr-only">{text}</span>
    </>
  );
}

/* =========================================================
   HEADER
========================================================= */

export default function Header() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT).fill(null)
  );

  const currentFrameRef = useRef(0);

  const drawFrameRef = useRef<(frame: number) => void>(() => {});

  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* =======================================================
     IMAGE SEQUENCE
  ======================================================= */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    imagesRef.current = new Array(FRAME_COUNT).fill(null);

    let destroyed = false;
    const timers: number[] = [];

    const context = canvas.getContext("2d", {
      alpha: false,
    });

    if (!context) return;

    /* =====================================================
       DRAW RESPONSIVELY
    ===================================================== */

    const drawImage = (image: HTMLImageElement) => {
      if (!canvas.width || !canvas.height) return;

      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;

      if (!imageWidth || !imageHeight) return;

      const isMobile = window.innerWidth < 768;

      const coverScale = Math.max(
        canvas.width / imageWidth,
        canvas.height / imageHeight
      );

      const containScale = Math.min(
        canvas.width / imageWidth,
        canvas.height / imageHeight
      );

      /*
       * Desktop uses cover for a cinematic fullscreen image.
       * Mobile uses contain so the main object is not heavily cropped.
       */
      const scale = isMobile ? containScale : coverScale;

      const renderedWidth = imageWidth * scale;
      const renderedHeight = imageHeight * scale;

      const x = (canvas.width - renderedWidth) / 2;
      const y = (canvas.height - renderedHeight) / 2;

      context.fillStyle = "#0B141C";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(image, x, y, renderedWidth, renderedHeight);
    };

    /* =====================================================
       CLOSEST LOADED FRAME
    ===================================================== */

    const findClosestLoadedImage = (
      requestedFrame: number
    ): HTMLImageElement | null => {
      const exact = imagesRef.current[requestedFrame];

      if (exact?.complete && exact.naturalWidth > 0) {
        return exact;
      }

      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const previous = requestedFrame - distance;
        const next = requestedFrame + distance;

        if (previous >= 0) {
          const image = imagesRef.current[previous];

          if (image?.complete && image.naturalWidth > 0) {
            return image;
          }
        }

        if (next < FRAME_COUNT) {
          const image = imagesRef.current[next];

          if (image?.complete && image.naturalWidth > 0) {
            return image;
          }
        }
      }

      return null;
    };

    /* =====================================================
       DRAW FRAME
    ===================================================== */

    const drawFrame = (requestedFrame: number) => {
      const frame = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(requestedFrame))
      );

      currentFrameRef.current = frame;

      const image = findClosestLoadedImage(frame);

      if (!image) return;

      drawImage(image);
    };

    drawFrameRef.current = drawFrame;

    /* =====================================================
       CANVAS SIZE
    ===================================================== */

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      drawFrame(currentFrameRef.current);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);

    resizeObserver.observe(canvas);

    /* =====================================================
       LOAD FRAME
    ===================================================== */

    const loadFrame = (index: number) => {
      if (index < 0 || index >= FRAME_COUNT || imagesRef.current[index]) {
        return;
      }

      const image = new Image();

      image.decoding = "async";

      imagesRef.current[index] = image;

      image.onload = () => {
        if (destroyed) return;

        if (index === 0) {
          setFirstFrameLoaded(true);
          drawFrame(0);
        }

        if (index === currentFrameRef.current) {
          drawFrame(index);
        }
      };

      image.onerror = () => {
        console.error(`Failed to load ${getFrameSrc(index)}`);
      };

      image.src = getFrameSrc(index);
    };

    loadFrame(0);

    for (
      let index = 1;
      index < Math.min(INITIAL_PRELOAD, FRAME_COUNT);
      index += 1
    ) {
      loadFrame(index);
    }

    /* =====================================================
       BACKGROUND PRELOAD
    ===================================================== */

    let batchIndex = 0;

    for (
      let start = INITIAL_PRELOAD;
      start < FRAME_COUNT;
      start += PRELOAD_BATCH_SIZE
    ) {
      const batchStart = start;

      const timer = window.setTimeout(() => {
        if (destroyed) return;

        const end = Math.min(batchStart + PRELOAD_BATCH_SIZE, FRAME_COUNT);

        for (let index = batchStart; index < end; index += 1) {
          loadFrame(index);
        }
      }, 180 + batchIndex * 110);

      timers.push(timer);

      batchIndex += 1;
    }

    return () => {
      destroyed = true;

      resizeObserver.disconnect();

      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      drawFrameRef.current = () => {};

      imagesRef.current = new Array(FRAME_COUNT).fill(null);
    };
  }, []);

  /* =======================================================
     SCROLL
  ======================================================= */

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      /* ===================================================
         ONE CONTINUOUS FRAME PLAYHEAD
      =================================================== */

      const playhead = {
        frame: 0,
      };

      gsap.to(playhead, {
        frame: FRAME_COUNT - 1,
        ease: "none",

        onUpdate: () => {
          drawFrameRef.current(playhead.frame);
        },

        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      /* ===================================================
         STORY TIMELINE
      =================================================== */

      const storyTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      /*
       * Forces timeline duration to exactly 1.
       * Story positions below therefore map directly
       * to scroll percentages.
       */
      const clock = { value: 0 };

      storyTimeline.to(
        clock,
        {
          value: 1,
          duration: 1,
          ease: "none",
        },
        0
      );

      STORIES.forEach((story, index) => {
        const stage = section.querySelector<HTMLElement>(
          `[data-story="${index}"]`
        );

        if (!stage) return;

        const letters = Array.from(
          stage.querySelectorAll<HTMLElement>(".cira-letter")
        );

        const secondary = Array.from(
          stage.querySelectorAll<HTMLElement>(".cira-secondary")
        );

        /* INITIAL STATE */

        if (index === 0) {
          gsap.set(stage, {
            autoAlpha: 1,
          });

          gsap.set(letters, {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            color: "#F5F7F4",
          });

          gsap.set(secondary, {
            opacity: 1,
            y: 0,
          });
        } else {
          gsap.set(stage, {
            autoAlpha: 0,
          });

          gsap.set(letters, {
            opacity: 0,
            x: -18,
            y: 8,
            filter: "blur(6px)",
            color: ACCENT,
          });

          gsap.set(secondary, {
            opacity: 0,
            y: 10,
          });
        }

        /* ENTER */

        if (index > 0) {
          const enter = story.enterStart;

          storyTimeline.set(
            stage,
            {
              autoAlpha: 1,
            },
            enter
          );

          storyTimeline.fromTo(
            letters,
            {
              opacity: 0,
              x: -22,
              y: 8,
              filter: "blur(7px)",
              color: ACCENT,
              textShadow: `0 0 20px ${ACCENT}`,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              color: "#F5F7F4",
              textShadow: "0 0 0px rgba(0,0,0,0)",
              duration: 0.035,
              stagger: {
                each: 0.0018,
                from: "start",
              },
              ease: "power2.out",
            },
            enter
          );

          storyTimeline.fromTo(
            secondary,
            {
              opacity: 0,
              y: 10,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.035,
              ease: "power2.out",
            },
            enter + 0.018
          );
        }

        /* EXIT */

        if (story.exitStart !== undefined) {
          const exit = story.exitStart;

          storyTimeline.to(
            secondary,
            {
              opacity: 0,
              y: -8,
              duration: 0.022,
              ease: "power2.in",
            },
            exit
          );

          storyTimeline.to(
            letters,
            {
              opacity: 0,
              x: 20,
              y: -7,
              filter: "blur(6px)",
              color: ACCENT,
              textShadow: `0 0 18px ${ACCENT}`,
              duration: 0.025,
              stagger: {
                each: 0.0012,
                from: "end",
              },
              ease: "power2.in",
            },
            exit
          );

          storyTimeline.set(
            stage,
            {
              autoAlpha: 0,
            },
            exit + 0.065
          );
        }
      });

      ScrollTrigger.refresh();
    },
    {
      scope: sectionRef,
    }
  );

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <header className="bg-[#071018] text-white">
      <section
        id="technology"
        ref={sectionRef}
        className="relative bg-[#071018]"
        style={{
          height: SCROLL_HEIGHT,
        }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#071018]">
          {/* CANVAS */}

          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          />

          {/* LOADING COVER */}

          <div
            className={`
              pointer-events-none
              absolute inset-0
              z-[5]
              bg-[#071018]
              transition-opacity
              duration-700
              ${firstFrameLoaded ? "opacity-0" : "opacity-100"}
            `}
          />

          {/* OVERLAYS */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-0
              z-[6]
              bg-gradient-to-b
              from-black/20
              via-transparent
              to-black/35
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-0
              z-[6]
              bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.25)_100%)]
            "
          />

          {/* NAVBAR */}

          <div className="absolute left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
            <nav
              className="
                relative
                mx-auto
                flex
                h-[58px]
                w-full
                max-w-[1500px]
                items-center
                justify-between

                rounded-[16px]
                border
                border-white/[0.1]

                bg-[#071018]/58
                px-4

                shadow-[0_18px_60px_rgba(0,0,0,0.2)]

                backdrop-blur-[22px]

                sm:h-[64px]
                sm:px-5

                lg:h-[70px]
                lg:px-6
              "
            >
              {/* CIRA */}

              <a
                href="#"
                aria-label="CIRA home"
                className="
                  text-[15px]
                  font-semibold
                  tracking-[0.16em]
                  text-white

                  sm:text-[16px]

                  lg:text-[17px]
                "
              >
                CIRA
              </a>

              {/* DESKTOP NAV */}

              <div className="hidden items-center gap-7 lg:flex">
                {navigation.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="
                      text-[12px]
                      font-medium
                      text-white/55
                      transition-colors
                      duration-200
                      hover:text-white
                    "
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* RIGHT */}

              <div className="flex items-center gap-3">
                <a
                  href="#technology"
                  className="
                    hidden
                    h-[38px]
                    items-center
                    justify-center

                    rounded-[9px]

                    bg-[#7CB2A9]

                    px-5

                    text-[11px]
                    font-semibold

                    text-[#08110F]

                    transition-all
                    duration-200

                    hover:bg-[#91C5BC]

                    sm:inline-flex
                  "
                >
                  Explore technology
                </a>

                {/* MOBILE MENU */}

                <button
                  type="button"
                  aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((current) => !current)}
                  className="
                    flex
                    h-9
                    w-9
                    flex-col
                    items-center
                    justify-center
                    gap-[5px]

                    rounded-full

                    border
                    border-white/[0.12]

                    bg-white/[0.04]

                    lg:hidden
                  "
                >
                  <span
                    className={`
                      h-px
                      w-4
                      bg-white
                      transition-transform
                      ${menuOpen ? "translate-y-[3px] rotate-45" : ""}
                    `}
                  />

                  <span
                    className={`
                      h-px
                      w-4
                      bg-white
                      transition-transform
                      ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}
                    `}
                  />
                </button>
              </div>

              {/* MOBILE NAV */}

              {menuOpen && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-[calc(100%+8px)]

                    overflow-hidden

                    rounded-[14px]

                    border
                    border-white/[0.1]

                    bg-[#09131B]/96

                    p-2

                    shadow-2xl

                    backdrop-blur-2xl

                    lg:hidden
                  "
                >
                  {navigation.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="
                        flex
                        h-[46px]
                        items-center

                        rounded-[9px]

                        px-4

                        text-[13px]
                        text-white/65

                        transition-colors

                        hover:bg-white/[0.05]
                        hover:text-white
                      "
                    >
                      {item.label}
                    </a>
                  ))}

                  <a
                    href="#technology"
                    onClick={() => setMenuOpen(false)}
                    className="
                      mt-2
                      flex
                      h-[46px]
                      items-center
                      justify-center

                      rounded-[9px]

                      bg-[#7CB2A9]

                      text-[12px]
                      font-semibold

                      text-[#071018]
                    "
                  >
                    Explore technology
                  </a>
                </div>
              )}
            </nav>
          </div>

          {/* STORY */}

          {STORIES.map((story, index) => (
            <article
              key={story.number}
              data-story={index}
              className={`
                pointer-events-none
                absolute
                inset-x-5
                bottom-[8svh]
                z-20

                sm:inset-x-8
                sm:bottom-[9svh]

                lg:inset-x-14
                lg:bottom-[8vh]

                ${story.align === "right" ? "md:flex md:justify-end" : ""}
              `}
            >
              <div
                className={`
                  w-full
                  max-w-[760px]

                  ${story.align === "right" ? "md:ml-auto md:text-right" : ""}
                `}
              >
                {/* LABEL */}

                <div
                  className={`
                    cira-secondary
                    mb-3
                    flex
                    items-center
                    gap-2

                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]

                    text-white/48

                    sm:text-[10px]

                    ${story.align === "right" ? "md:justify-end" : ""}
                  `}
                >
                  <span className="text-[#7CB2A9]">{story.number}</span>

                  <span>{story.label}</span>
                </div>

                {/* HEADLINE */}

                <div
                  className="
                    text-[clamp(2.35rem,4.8vw,5.5rem)]
                    font-[450]
                    leading-[0.94]
                    tracking-[-0.055em]
                  "
                >
                  {story.lines.map((line) => (
                    <div key={line}>
                      <SplitLine text={line} />
                    </div>
                  ))}
                </div>

                {/* DESCRIPTION */}

                <div
                  className={`
                    cira-secondary
                    mt-4
                    flex

                    sm:mt-5

                    ${story.align === "right" ? "md:justify-end" : ""}
                  `}
                >
                  <p
                    className="
                      max-w-[320px]
                      text-[11px]
                      leading-[1.55]
                      text-white/48

                      sm:max-w-[390px]
                      sm:text-[13px]

                      lg:text-[14px]
                    "
                  >
                    {story.description}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {/* SCROLL INDICATOR */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-5
              right-5
              z-30

              hidden
              items-center
              gap-3

              text-[8px]
              font-semibold
              uppercase
              tracking-[0.22em]

              text-white/30

              sm:flex
            "
          >
            Scroll
            <span className="h-px w-8 bg-white/20" />
          </div>
        </div>
      </section>
    </header>
  );
}
