import { CheckCircle, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateLetter } from "../hooks/useQueries";
import { FloralHeader } from "./FloralHeader";
import { Footer } from "./Footer";
import { PageShell } from "./PageShell";

interface ComposeViewProps {
  onSuccess: () => void;
  onViewLetters: () => void;
}

const THEMES = [
  { key: "parchment", label: "Parchment", bg: "oklch(0.95 0.022 67)" },
  { key: "rose", label: "Rose", bg: "oklch(0.93 0.025 358)" },
  { key: "sage", label: "Sage", bg: "oklch(0.93 0.022 150)" },
  { key: "lavender", label: "Lavender", bg: "oklch(0.93 0.022 290)" },
  { key: "sky", label: "Sky", bg: "oklch(0.93 0.020 225)" },
] as const;

type ThemeKey = (typeof THEMES)[number]["key"];

export function ComposeView({ onSuccess, onViewLetters }: ComposeViewProps) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [theme, setTheme] = useState<ThemeKey>("parchment");
  const [showSuccess, setShowSuccess] = useState(false);

  const createLetter = useCreateLetter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !from.trim() || !body.trim()) {
      toast.error("Please fill in the recipient, sender, and letter body.");
      return;
    }

    try {
      await createLetter.mutateAsync({
        to: to.trim(),
        from: from.trim(),
        title: title.trim(),
        body: body.trim(),
        bouquet: "",
        theme,
      });
      setShowSuccess(true);
      toast.success("Your letter has been sealed ✦");
      setTimeout(() => {
        onSuccess();
      }, 1400);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const isPending = createLetter.isPending;

  // Derive the gradient for the selected theme
  const themeGradients: Record<ThemeKey, string> = {
    parchment:
      "linear-gradient(to bottom, oklch(0.97 0.015 74), oklch(0.94 0.020 68))",
    rose: "linear-gradient(to bottom, oklch(0.97 0.018 5), oklch(0.94 0.025 358))",
    sage: "linear-gradient(to bottom, oklch(0.97 0.015 155), oklch(0.94 0.022 150))",
    lavender:
      "linear-gradient(to bottom, oklch(0.97 0.016 295), oklch(0.94 0.022 290))",
    sky: "linear-gradient(to bottom, oklch(0.97 0.014 230), oklch(0.94 0.020 225))",
  };

  return (
    <PageShell>
      <FloralHeader
        onCompose={() => {}}
        onLetters={onViewLetters}
        currentView="compose"
      />

      <main className="flex-1 flex flex-col items-center px-4 py-10 pb-16">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              data-ocid="compose.success_state"
              className="flex flex-col items-center justify-center gap-5 py-20 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                <CheckCircle
                  className="w-14 h-14 text-primary/80"
                  strokeWidth={1.3}
                />
              </motion.div>
              <div>
                <h2 className="font-display text-2xl text-foreground italic">
                  Letter sealed with love ✦
                </h2>
                <p className="font-letter text-muted-foreground mt-1.5 italic">
                  Taking you to your letters…
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.42 }}
              className="w-full max-w-2xl"
            >
              {/* Stationery card */}
              <div
                className="relative bg-card bg-linen aged-border ornate-corner overflow-hidden"
                style={{
                  borderRadius: "3px",
                  backgroundImage: themeGradients[theme],
                  boxShadow:
                    "0 6px 30px rgba(60,30,10,0.14), 0 2px 8px rgba(60,30,10,0.08), inset 0 1px 0 rgba(255,245,230,0.6)",
                  transition: "background-image 0.4s ease",
                }}
              >
                {/* Decorative top stripe */}
                <div className="h-1.5 w-full sepia-stripe opacity-75" />

                {/* Letterhead */}
                <div className="px-8 pt-6 pb-5 border-b border-border/50 text-center">
                  <p className="font-display text-base italic text-foreground/50 tracking-wide">
                    a quiet place for heartfelt words
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div
                      className="flex-1 h-px max-w-16 opacity-30"
                      style={{ background: "oklch(0.62 0.07 28)" }}
                    />
                    <span className="text-xs text-primary/35 font-letter tracking-[0.3em] select-none">
                      ❀
                    </span>
                    <div
                      className="flex-1 h-px max-w-16 opacity-30"
                      style={{ background: "oklch(0.62 0.07 28)" }}
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="px-6 md:px-10 py-7 space-y-6"
                >
                  {/* To / From — underline only, old paper form style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label
                        htmlFor="to"
                        className="font-letter text-xs tracking-widest uppercase text-muted-foreground/80"
                      >
                        To
                      </label>
                      <div className="relative flex items-center">
                        <span className="font-letter italic text-muted-foreground text-base mr-2 shrink-0">
                          Dear
                        </span>
                        <input
                          id="to"
                          data-ocid="compose.to_input"
                          type="text"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                          placeholder="recipient's name…"
                          className="flex-1 bg-transparent border-0 border-b border-border/70 font-letter text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 pb-1 transition-colors"
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="from"
                        className="font-letter text-xs tracking-widest uppercase text-muted-foreground/80"
                      >
                        From
                      </label>
                      <div className="relative flex items-center">
                        <span className="font-letter italic text-muted-foreground text-base mr-2 shrink-0">
                          ~
                        </span>
                        <input
                          id="from"
                          data-ocid="compose.from_input"
                          type="text"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                          placeholder="your name…"
                          className="flex-1 bg-transparent border-0 border-b border-border/70 font-letter text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 pb-1 transition-colors"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label
                      htmlFor="title"
                      className="font-letter text-xs tracking-widest uppercase text-muted-foreground/80"
                    >
                      Subject{" "}
                      <span className="normal-case font-letter italic text-muted-foreground/60 text-xs tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="title"
                      data-ocid="compose.title_input"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="a little note about this letter…"
                      className="w-full bg-transparent border-0 border-b border-border/70 font-letter text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 pb-1 transition-colors"
                    />
                  </div>

                  {/* Botanical divider */}
                  <div className="floral-divider" aria-hidden />

                  {/* Body — with left margin rule */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="body"
                      className="font-letter text-xs tracking-widest uppercase text-muted-foreground/80"
                    >
                      Your letter
                    </label>
                    <div className="relative">
                      {/* Red margin line */}
                      <div
                        className="absolute left-7 top-0 bottom-0 w-px opacity-50 pointer-events-none"
                        style={{ background: "oklch(0.58 0.14 22)" }}
                      />
                      <textarea
                        id="body"
                        data-ocid="compose.body_textarea"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder={
                          "Write what's in your heart…\n\nPerhaps what you've been meaning to say,\nor something small and sweet."
                        }
                        rows={11}
                        className="w-full pl-10 pr-4 py-3 bg-transparent border border-border/50 font-letter text-base text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 transition-all resize-none paper-lines leading-[1.75rem]"
                        style={{ borderRadius: "2px" }}
                      />
                    </div>
                  </div>

                  {/* Theme picker */}
                  <div className="space-y-2 pt-1">
                    <p className="font-letter text-xs tracking-widest uppercase text-muted-foreground/80">
                      Choose your paper ✦
                    </p>
                    <div
                      className="flex items-center gap-2.5"
                      role="radiogroup"
                      aria-label="Paper theme"
                    >
                      {THEMES.map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          data-ocid={`compose.${t.key}.toggle`}
                          role="radio"
                          aria-checked={theme === t.key}
                          aria-label={t.label}
                          onClick={() => setTheme(t.key)}
                          className="relative w-7 h-7 rounded-full border-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                          style={{
                            background: t.bg,
                            borderColor:
                              theme === t.key
                                ? "oklch(0.50 0.10 40)"
                                : "oklch(0.75 0.04 65 / 0.6)",
                            boxShadow:
                              theme === t.key
                                ? "0 0 0 2px oklch(0.97 0.015 74), 0 0 0 4px oklch(0.50 0.10 40 / 0.5)"
                                : "0 1px 3px rgba(60,30,10,0.12)",
                            transform:
                              theme === t.key ? "scale(1.15)" : "scale(1)",
                          }}
                          title={t.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-1 pb-1">
                    {isPending ? (
                      <div
                        data-ocid="compose.loading_state"
                        className="flex items-center gap-2 text-muted-foreground font-letter text-sm italic"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sealing your letter…
                      </div>
                    ) : (
                      <motion.button
                        data-ocid="compose.submit_button"
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary/90 text-primary-foreground font-letter text-base shadow-vintage hover:shadow-vintage-hover transition-all cursor-pointer border border-primary/50"
                        style={{ borderRadius: "2px" }}
                      >
                        Seal &amp; Send ✦
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>

              {/* Hint */}
              <p className="text-center font-letter italic text-muted-foreground text-sm mt-5">
                ✿ Letters are saved forever, like pressed flowers in a book ✿
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </PageShell>
  );
}
