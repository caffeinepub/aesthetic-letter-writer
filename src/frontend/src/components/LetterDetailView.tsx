import { AlertTriangle, ArrowLeft, PenLine, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Letter } from "../backend.d";
import { useDeleteLetter } from "../hooks/useQueries";
import { EnvelopeReveal } from "./EnvelopeReveal";
import { FloralHeader } from "./FloralHeader";
import { Footer } from "./Footer";
import { PageShell } from "./PageShell";

interface LetterDetailViewProps {
  letter: Letter;
  onBack: () => void;
  onCompose: () => void;
}

function formatDate(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type ThemeKey = "parchment" | "rose" | "sage" | "lavender" | "sky";

const themeArticleGradients: Record<ThemeKey, string> = {
  parchment:
    "linear-gradient(160deg, oklch(0.97 0.013 75), oklch(0.93 0.022 67))",
  rose: "linear-gradient(160deg, oklch(0.97 0.018 5), oklch(0.93 0.025 358))",
  sage: "linear-gradient(160deg, oklch(0.97 0.015 155), oklch(0.93 0.022 150))",
  lavender:
    "linear-gradient(160deg, oklch(0.97 0.016 295), oklch(0.93 0.022 290))",
  sky: "linear-gradient(160deg, oklch(0.97 0.014 230), oklch(0.93 0.020 225))",
};

function getArticleGradient(theme: string): string {
  return (
    themeArticleGradients[theme as ThemeKey] ?? themeArticleGradients.parchment
  );
}

export function LetterDetailView({
  letter,
  onBack,
  onCompose,
}: LetterDetailViewProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteLetter = useDeleteLetter();

  const handleDelete = async () => {
    try {
      await deleteLetter.mutateAsync(letter.id);
      toast.success("Letter gently let go ✦");
      onBack();
    } catch {
      toast.error("Could not delete the letter. Please try again.");
    }
  };

  const paragraphs = letter.body.split(/\n+/).filter(Boolean);

  return (
    <PageShell>
      <FloralHeader
        onCompose={onCompose}
        onLetters={onBack}
        currentView="detail"
      />

      <main className="flex-1 px-4 py-10 pb-16 max-w-2xl mx-auto w-full">
        <EnvelopeReveal theme={letter.theme}>
          {/* Back navigation */}
          <motion.button
            type="button"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-letter text-sm mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back to letters
          </motion.button>

          {/* Letter card */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-card bg-linen aged-border aged-bottom-edge ornate-corner overflow-hidden"
            style={{
              borderRadius: "3px",
              backgroundImage: getArticleGradient(letter.theme),
              boxShadow:
                "0 8px 40px rgba(60,30,10,0.16), 0 2px 10px rgba(60,30,10,0.10), inset 0 1px 0 rgba(255,245,230,0.6), inset 0 0 0 1px rgba(200,170,130,0.10)",
            }}
          >
            {/* Top decorative stripe */}
            <div className="h-1.5 w-full sepia-stripe opacity-70" />

            {/* Wax seal — prominent positioning */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
              className="absolute top-8 right-8 w-14 h-14 rounded-full wax-seal flex items-center justify-center"
            >
              <span className="text-white/75 text-lg font-display font-bold select-none">
                ✦
              </span>
            </motion.div>

            {/* Header */}
            <div className="px-8 md:px-12 pt-8 pb-6 border-b border-border/40">
              {/* Vintage stamp date */}
              <div className="mb-4">
                <span className="vintage-stamp">
                  {formatDate(letter.createdAt)}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-tight italic pr-16">
                {letter.title || "Untitled Letter"}
              </h2>
              <div className="mt-3.5 flex flex-col gap-1.5">
                <p className="font-letter text-base text-foreground/80">
                  <span className="italic text-muted-foreground">To</span>{" "}
                  <span className="font-medium">{letter.to}</span>
                </p>
                <p className="font-letter text-base text-foreground/80">
                  <span className="italic text-muted-foreground">From</span>{" "}
                  <span className="font-medium">{letter.from}</span>
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 md:px-12 py-8">
              <div className="floral-divider mb-5" aria-hidden />

              <div className="space-y-5">
                {paragraphs.map((para, i) => (
                  <p
                    key={`para-${i}-${para.slice(0, 8)}`}
                    className={[
                      "font-letter text-lg text-foreground leading-[1.85]",
                      i === 0 ? "drop-cap" : "",
                    ].join(" ")}
                  >
                    {para}
                  </p>
                ))}
              </div>
              <div className="floral-divider mt-7 mb-4" aria-hidden />
              <p className="font-letter text-base italic text-foreground/65 text-right">
                With love, {letter.from}
              </p>
            </div>
          </motion.article>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="flex items-center justify-between mt-7 gap-3"
          >
            <button
              type="button"
              data-ocid="letter.delete_button"
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-destructive/65 hover:text-destructive hover:bg-destructive/8 font-letter text-sm transition-all cursor-pointer border border-transparent hover:border-destructive/20"
              style={{ borderRadius: "2px" }}
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.8} />
              Let it go
            </button>

            <motion.button
              type="button"
              onClick={onCompose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/90 text-primary-foreground font-letter text-base shadow-vintage hover:shadow-vintage-hover transition-all cursor-pointer border border-primary/50"
              style={{ borderRadius: "2px" }}
            >
              <PenLine className="w-4 h-4" strokeWidth={1.8} />
              Write another
            </motion.button>
          </motion.div>
        </EnvelopeReveal>

        {/* Delete confirmation dialog */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-ocid="letter.dialog"
              className="fixed inset-0 bg-foreground/25 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 5 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card bg-linen aged-border p-8 max-w-sm w-full text-center relative overflow-hidden"
                style={{
                  borderRadius: "3px",
                  backgroundImage:
                    "linear-gradient(155deg, oklch(0.97 0.014 74), oklch(0.94 0.018 68))",
                  boxShadow:
                    "0 12px 44px rgba(60,30,10,0.20), 0 2px 8px rgba(60,30,10,0.12)",
                }}
              >
                {/* Top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 sepia-stripe opacity-60" />

                <div className="flex justify-center mb-4 mt-2">
                  <div
                    className="w-12 h-12 bg-destructive/10 flex items-center justify-center"
                    style={{ borderRadius: "50%" }}
                  >
                    <AlertTriangle
                      className="w-5 h-5 text-destructive/80"
                      strokeWidth={1.8}
                    />
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 italic">
                  Let this letter go?
                </h3>
                <p className="font-letter text-muted-foreground mb-7 text-base leading-relaxed">
                  This letter will be gone, like a wish carried on the wind.
                  This cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    data-ocid="letter.cancel_button"
                    onClick={() => setShowConfirm(false)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 border border-border text-foreground font-letter text-base hover:bg-secondary/60 transition-colors cursor-pointer"
                    style={{ borderRadius: "2px" }}
                  >
                    <X className="w-4 h-4" strokeWidth={1.8} />
                    Keep it
                  </button>
                  <button
                    type="button"
                    data-ocid="letter.confirm_button"
                    onClick={handleDelete}
                    disabled={deleteLetter.isPending}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-destructive text-destructive-foreground font-letter text-base shadow-sm hover:shadow-md transition-shadow cursor-pointer disabled:opacity-50"
                    style={{ borderRadius: "2px" }}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                    {deleteLetter.isPending ? "Releasing…" : "Release it"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </PageShell>
  );
}
