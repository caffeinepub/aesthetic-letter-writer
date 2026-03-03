export function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="py-8 px-4 text-center border-t border-border/50 mt-4">
      <p className="font-letter text-sm text-muted-foreground italic">
        © {year}. Built with{" "}
        <span className="text-primary" aria-hidden>
          ♡
        </span>{" "}
        using{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/80 hover:text-primary underline-offset-2 hover:underline transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}
