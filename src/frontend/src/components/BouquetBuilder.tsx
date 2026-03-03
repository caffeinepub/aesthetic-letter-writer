import { motion } from "motion/react";

const FLOWERS = [
  "🌸",
  "🌼",
  "🌺",
  "🌻",
  "🌷",
  "🌹",
  "💐",
  "🍀",
  "🌿",
  "🪷",
  "🫐",
  "🌾",
];

const MAX_BOUQUET = 6;

interface BouquetBuilderProps {
  bouquet: string;
  onChange: (bouquet: string) => void;
}

export function BouquetBuilder({ bouquet, onChange }: BouquetBuilderProps) {
  // bouquet is a string of concatenated emoji characters
  const flowerArray = [...bouquet]; // spread handles multi-byte emoji correctly

  const handleAdd = (flower: string) => {
    if (flowerArray.length >= MAX_BOUQUET) return;
    onChange(bouquet + flower);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-3 py-1">
      {/* Section label */}
      <div className="flex items-center justify-between">
        <p className="font-letter text-xs tracking-widest uppercase text-muted-foreground/80">
          Tuck in a little bouquet ✿
        </p>
        {flowerArray.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="font-letter text-xs italic text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
          >
            clear
          </button>
        )}
      </div>

      {/* Flower palette */}
      <div className="flex flex-wrap gap-1.5">
        {FLOWERS.map((flower) => (
          <motion.button
            key={flower}
            type="button"
            onClick={() => handleAdd(flower)}
            disabled={flowerArray.length >= MAX_BOUQUET}
            whileHover={{ scale: flowerArray.length < MAX_BOUQUET ? 1.22 : 1 }}
            whileTap={{ scale: flowerArray.length < MAX_BOUQUET ? 0.9 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className={[
              "w-9 h-9 flex items-center justify-center text-lg rounded-full border transition-all cursor-pointer select-none",
              flowerArray.length >= MAX_BOUQUET
                ? "opacity-35 cursor-not-allowed border-border/30 bg-transparent"
                : "border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10",
            ].join(" ")}
            aria-label={`Add ${flower} to bouquet`}
          >
            {flower}
          </motion.button>
        ))}
      </div>

      {/* Live bouquet preview */}
      {flowerArray.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 py-2.5 px-4 rounded-sm border border-primary/20 bg-primary/5"
          style={{ borderRadius: "2px" }}
        >
          <span className="font-letter text-xs italic text-muted-foreground/70 shrink-0">
            Your bouquet:
          </span>
          <span className="text-xl tracking-wide leading-none">
            {flowerArray.join(" ")}
          </span>
          <span className="font-letter text-xs italic text-muted-foreground/50 ml-auto shrink-0">
            {flowerArray.length}/{MAX_BOUQUET}
          </span>
        </motion.div>
      ) : (
        <div className="flex items-center gap-2 py-2.5 px-4 border border-dashed border-border/40 rounded-sm">
          <span className="font-letter text-xs italic text-muted-foreground/40">
            Pick flowers above to add a little bouquet…
          </span>
        </div>
      )}
    </div>
  );
}
