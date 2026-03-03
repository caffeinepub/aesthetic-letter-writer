import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface EnvelopeRevealProps {
  theme: string; // e.g. "parchment", "rose", "sage", "lavender", "sky"
  children: React.ReactNode;
}

type PhaseType = "closed" | "opening" | "sliding" | "done";

const envelopeThemes: Record<
  string,
  { bg: string; flap: string; inside: string; shadow: string }
> = {
  parchment: {
    bg: "oklch(0.94 0.018 68)",
    flap: "oklch(0.91 0.022 65)",
    inside: "oklch(0.97 0.014 74)",
    shadow: "rgba(80,50,20,0.22)",
  },
  rose: {
    bg: "oklch(0.93 0.025 358)",
    flap: "oklch(0.90 0.030 355)",
    inside: "oklch(0.97 0.018 5)",
    shadow: "rgba(100,30,50,0.18)",
  },
  sage: {
    bg: "oklch(0.93 0.022 150)",
    flap: "oklch(0.90 0.025 148)",
    inside: "oklch(0.97 0.015 155)",
    shadow: "rgba(30,60,40,0.18)",
  },
  lavender: {
    bg: "oklch(0.93 0.022 290)",
    flap: "oklch(0.90 0.025 288)",
    inside: "oklch(0.97 0.016 295)",
    shadow: "rgba(60,30,80,0.18)",
  },
  sky: {
    bg: "oklch(0.93 0.020 225)",
    flap: "oklch(0.90 0.022 222)",
    inside: "oklch(0.97 0.014 230)",
    shadow: "rgba(20,50,80,0.18)",
  },
};

function getTheme(key: string) {
  return envelopeThemes[key] ?? envelopeThemes.parchment;
}

export function EnvelopeReveal({ theme, children }: EnvelopeRevealProps) {
  const [phase, setPhase] = useState<PhaseType>("closed");
  const t = getTheme(theme);

  useEffect(() => {
    // Phase 1: closed envelope appears → 0.5s
    // Phase 2: flap opens → at 0.8s
    // Phase 3: letter slides out → at 1.4s
    // Phase 4: done → at 1.9s
    const t1 = setTimeout(() => setPhase("opening"), 800);
    const t2 = setTimeout(() => setPhase("sliding"), 1400);
    const t3 = setTimeout(() => setPhase("done"), 1950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <>
      {/* Letter content — always in DOM, visible after animation */}
      <AnimatePresence>
        {phase === "sliding" && (
          <motion.div
            key="letter-slide"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none"
            style={{ position: "relative", zIndex: 1 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "done" && <div>{children}</div>}

      {/* Envelope overlay — covers screen during animation */}
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="envelope-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.22 0.03 60 / 0.55) 0%, oklch(0.12 0.02 60 / 0.72) 100%)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {/* Envelope container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: phase === "sliding" ? 0.8 : 1,
                opacity: phase === "sliding" ? 0 : 1,
              }}
              transition={{
                scale: {
                  duration: phase === "sliding" ? 0.5 : 0.5,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: phase === "sliding" ? 0.5 : 0.5,
                  ease: "easeInOut",
                },
              }}
              style={{
                width: 320,
                height: 220,
                position: "relative",
                perspective: 800,
              }}
            >
              {/* Envelope body */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: t.bg,
                  borderRadius: 4,
                  border: "1px solid oklch(0.75 0.04 65 / 0.5)",
                  boxShadow: `0 12px 48px ${t.shadow}, 0 4px 16px ${t.shadow}, inset 0 1px 0 rgba(255,248,235,0.6)`,
                  overflow: "hidden",
                }}
              >
                {/* Bottom V-fold lines (decorative inner envelope lines) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
                >
                  {/* Left triangle fold */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: "110px 160px 0 0",
                      borderColor: `${t.flap} transparent transparent transparent`,
                      opacity: 0.6,
                    }}
                  />
                  {/* Right triangle fold */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: "0 0 110px 160px",
                      borderColor: `transparent transparent ${t.flap} transparent`,
                      opacity: 0.6,
                    }}
                  />
                  {/* Center bottom V */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: "0 160px 110px 160px",
                      borderColor:
                        "transparent transparent oklch(0.88 0.025 65 / 0.35) transparent",
                    }}
                  />
                </div>

                {/* Inside of envelope — peeking (lighter strip at top) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    background: t.inside,
                    opacity: 0.7,
                  }}
                />

                {/* Subtle linen texture lines */}
                {[0.25, 0.5, 0.75].map((pos) => (
                  <div
                    key={pos}
                    style={{
                      position: "absolute",
                      left: "10%",
                      right: "10%",
                      top: `${pos * 100}%`,
                      height: 1,
                      background: "oklch(0.72 0.03 65 / 0.18)",
                    }}
                  />
                ))}
              </div>

              {/* Envelope flap — animated open */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 0,
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  rotateX: 0,
                  zIndex: 10,
                }}
                animate={{
                  rotateX:
                    phase === "opening" || phase === "sliding" ? -162 : 0,
                }}
                transition={{
                  rotateX: {
                    duration: 0.62,
                    ease: [0.4, 0, 0.2, 1],
                    delay: phase === "opening" ? 0.05 : 0,
                  },
                }}
              >
                {/* Flap triangle shape */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    borderWidth: "0 160px 130px 160px",
                    borderColor: `transparent transparent ${t.flap} transparent`,
                    filter: `drop-shadow(0 3px 6px ${t.shadow})`,
                  }}
                />

                {/* Flap back face (visible when open) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    borderWidth: "0 160px 130px 160px",
                    borderColor: `transparent transparent ${t.inside} transparent`,
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                  }}
                />

                {/* Kiss seal — centered on the flap */}
                <div
                  style={{
                    position: "absolute",
                    top: 60,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 38% 38%, oklch(0.52 0.20 18), oklch(0.38 0.18 15))",
                    border: "2px solid oklch(0.58 0.16 18 / 0.6)",
                    boxShadow:
                      "0 2px 8px oklch(0.38 0.18 15 / 0.45), inset 0 1px 0 oklch(0.62 0.16 18 / 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: 1,
                      userSelect: "none",
                      filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
                    }}
                    role="img"
                    aria-label="kiss seal"
                  >
                    💋
                  </span>
                </div>
              </motion.div>

              {/* Thin border overlay for crispness */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 4,
                  border: "1px solid oklch(0.70 0.04 65 / 0.35)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>

            {/* Decorative hint text */}
            <AnimatePresence>
              {phase === "closed" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                  style={{
                    position: "absolute",
                    bottom: "calc(50% - 160px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "oklch(0.92 0.015 65)",
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 14,
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  ✦ a letter for you ✦
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
