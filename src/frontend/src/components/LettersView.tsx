import { Mail, PenLine } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Letter } from "../backend.d";
import { useGetLetters } from "../hooks/useQueries";
import { FloralHeader } from "./FloralHeader";
import { Footer } from "./Footer";
import { PageShell } from "./PageShell";

interface LettersViewProps {
  onCompose: () => void;
  onOpenLetter: (letter: Letter) => void;
}

function formatDate(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type ThemeKey = "parchment" | "rose" | "sage" | "lavender" | "sky";

const themeCardGradients: Record<ThemeKey, string> = {
  parchment:
    "linear-gradient(155deg, oklch(0.97 0.014 74), oklch(0.94 0.018 68))",
  rose: "linear-gradient(155deg, oklch(0.97 0.018 5), oklch(0.94 0.025 358))",
  sage: "linear-gradient(155deg, oklch(0.97 0.015 155), oklch(0.94 0.022 150))",
  lavender:
    "linear-gradient(155deg, oklch(0.97 0.016 295), oklch(0.94 0.022 290))",
  sky: "linear-gradient(155deg, oklch(0.97 0.014 230), oklch(0.94 0.020 225))",
};

function getThemeGradient(theme: string): string {
  return themeCardGradients[theme as ThemeKey] ?? themeCardGradients.parchment;
}

function LetterCard({
  letter,
  index,
  onClick,
}: {
  letter: Letter;
  index: number;
  onClick: () => void;
}) {
  const preview = letter.body.slice(0, 110).trim();
  const hasMore = letter.body.length > 110;
  // Alternate tilts for moodboard effect
  const tilt = index % 2 === 0 ? -1 : 0.8;

  return (
    <motion.button
      type="button"
      data-ocid={`letters.item.${index}`}
      initial={{ opacity: 0, y: 20, rotate: tilt }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
      whileHover={{
        y: -6,
        rotate: 0,
        boxShadow:
          "0 12px 44px rgba(60,30,10,0.20), 0 2px 8px rgba(60,30,10,0.12)",
      }}
      onClick={onClick}
      className="bg-card aged-bottom-edge bg-linen cursor-pointer overflow-hidden group text-left w-full aged-border"
      style={{
        borderRadius: "3px",
        backgroundImage: getThemeGradient(letter.theme),
        boxShadow:
          "0 4px 18px rgba(60,30,10,0.13), 0 1px 4px rgba(60,30,10,0.08), inset 0 1px 0 rgba(255,245,230,0.55)",
      }}
    >
      {/* Top sepia stripe */}
      <div className="h-1 w-full opacity-80 group-hover:opacity-100 transition-opacity sepia-stripe" />

      <div className="px-5 py-4 relative">
        {/* Ornamental corner flourish */}
        <span
          className="absolute top-3 right-4 text-primary/30 text-xs select-none pointer-events-none"
          aria-hidden
        >
          ✿
        </span>

        {/* "To:" tag label */}
        <div className="mb-3">
          <span
            className="inline-block text-xs tracking-wider uppercase font-letter border px-2 py-0.5 text-primary/70 border-primary/30"
            style={{ borderRadius: "2px" }}
          >
            To: {letter.to}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1 truncate italic">
          {letter.title || "Untitled Letter"}
        </h3>
        <p className="font-letter text-sm text-muted-foreground mb-3">
          <span className="italic">from</span>{" "}
          <span className="font-medium text-foreground/80">{letter.from}</span>
        </p>

        {/* Body preview */}
        <p className="font-letter text-base text-foreground/70 leading-relaxed line-clamp-3 mb-3">
          {preview}
          {hasMore && <span className="text-muted-foreground/60">…</span>}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto">
          {/* Vintage stamp date */}
          <span className="vintage-stamp">{formatDate(letter.createdAt)}</span>
          <span className="text-primary/35 group-hover:text-primary/65 transition-colors">
            <Mail className="w-4 h-4" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export function LettersView({ onCompose, onOpenLetter }: LettersViewProps) {
  const { data: letters, isLoading } = useGetLetters();

  const sorted = [...(letters ?? [])].sort((a, b) =>
    Number(b.createdAt - a.createdAt),
  );

  return (
    <PageShell>
      <FloralHeader
        onCompose={onCompose}
        onLetters={() => {}}
        currentView="letters"
      />

      <main className="flex-1 px-4 py-10 pb-16 max-w-4xl mx-auto w-full">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground italic">
              Your Letters
            </h2>
            {!isLoading && sorted.length > 0 && (
              <p className="font-letter text-sm text-muted-foreground mt-0.5 italic">
                {sorted.length} {sorted.length === 1 ? "letter" : "letters"}{" "}
                kept safe
              </p>
            )}
          </div>
          <motion.button
            type="button"
            data-ocid="nav.compose_button"
            onClick={onCompose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary/90 text-primary-foreground font-letter text-sm shadow-vintage hover:shadow-vintage-hover transition-shadow cursor-pointer border border-primary/50"
            style={{ borderRadius: "2px" }}
          >
            <PenLine className="w-4 h-4" strokeWidth={1.8} />
            Write a letter
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-ocid="letters.loading_state"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-border bg-card h-52 animate-pulse bg-linen"
                  style={{ borderRadius: "3px" }}
                />
              ))}
            </motion.div>
          ) : sorted.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="letters.empty_state"
              className="flex flex-col items-center justify-center py-24 text-center gap-5"
            >
              <div className="text-4xl opacity-40 select-none">✉</div>
              <div>
                <h3 className="font-display text-xl text-foreground italic">
                  No letters yet
                </h3>
                <p className="font-letter italic text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Your letters will gather here, like pressed flowers between
                  the pages of a beloved book.
                </p>
              </div>
              <motion.button
                type="button"
                onClick={onCompose}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="mt-1 px-7 py-2.5 bg-primary/90 text-primary-foreground font-letter text-base shadow-vintage hover:shadow-vintage-hover transition-shadow cursor-pointer border border-primary/50"
                style={{ borderRadius: "2px" }}
              >
                ✦ Begin writing
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 gap-7"
            >
              {sorted.map((letter, i) => (
                <LetterCard
                  key={letter.id.toString()}
                  letter={letter}
                  index={i + 1}
                  onClick={() => onOpenLetter(letter)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </PageShell>
  );
}
