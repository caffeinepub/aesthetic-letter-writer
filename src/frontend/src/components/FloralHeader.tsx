import { motion } from "motion/react";

interface FloralHeaderProps {
  onCompose: () => void;
  onLetters: () => void;
  currentView: "compose" | "letters" | "detail";
}

export function FloralHeader({
  onCompose,
  onLetters,
  currentView,
}: FloralHeaderProps) {
  return (
    <header className="relative pt-10 pb-5 px-4 text-center overflow-hidden bg-linen">
      {/* Botanical banner image */}
      <div className="absolute inset-x-0 top-0 h-28 overflow-hidden opacity-40 pointer-events-none">
        <img
          src="/assets/generated/letter-botanical-banner.dim_1200x200.png"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Decorative top rule */}
      <div className="relative z-10 flex items-center justify-center gap-3 mb-5">
        <div
          className="flex-1 max-w-28 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.62 0.07 28 / 0.4))",
          }}
        />
        <span className="text-xs tracking-[0.4em] text-primary/60 font-letter select-none">
          ✦ ✦ ✦
        </span>
        <div
          className="flex-1 max-w-28 h-px"
          style={{
            background:
              "linear-gradient(to left, transparent, oklch(0.62 0.07 28 / 0.4))",
          }}
        />
      </div>

      {/* Masthead title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <p className="text-xs font-letter tracking-[0.45em] uppercase text-muted-foreground/70 mb-1.5 italic">
          A quiet place for
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight italic tracking-tight">
          Dear Letters
        </h1>
        <p className="font-letter italic text-muted-foreground text-sm mt-2 tracking-wide">
          a quiet place for heartfelt words
        </p>

        {/* Ornamental rule */}
        <div className="mt-3 mb-4 flex items-center justify-center">
          <span className="font-letter text-sm tracking-[0.5em] text-primary/55 select-none">
            — ✿ — ❀ — ✿ —
          </span>
        </div>
      </motion.div>

      {/* Nav tabs */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="relative z-10 flex items-center justify-center gap-1"
        aria-label="Main navigation"
      >
        <button
          type="button"
          data-ocid="nav.compose_button"
          onClick={onCompose}
          className={[
            "px-6 py-1.5 font-letter text-sm tracking-wide transition-all duration-200 border",
            currentView === "compose"
              ? "bg-primary/90 text-primary-foreground border-primary/60 shadow-sm"
              : "text-muted-foreground border-border/60 hover:text-foreground hover:border-border hover:bg-secondary/60 bg-transparent",
          ].join(" ")}
          style={{ borderRadius: "2px" }}
        >
          ✦ Write
        </button>
        <button
          type="button"
          data-ocid="nav.letters_button"
          onClick={onLetters}
          className={[
            "px-6 py-1.5 font-letter text-sm tracking-wide transition-all duration-200 border",
            currentView === "letters" || currentView === "detail"
              ? "bg-primary/90 text-primary-foreground border-primary/60 shadow-sm"
              : "text-muted-foreground border-border/60 hover:text-foreground hover:border-border hover:bg-secondary/60 bg-transparent",
          ].join(" ")}
          style={{ borderRadius: "2px" }}
        >
          ✉ Letters
        </button>
      </motion.nav>

      {/* Bottom border */}
      <div className="mt-5 sepia-stripe h-0.5 w-full opacity-50" />
    </header>
  );
}
