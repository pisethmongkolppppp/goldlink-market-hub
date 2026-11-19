import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="GoldLink AI home">
      <span className="grid size-9 place-items-center rounded-lg bg-gradient-gold shadow-gold">
        <svg viewBox="0 0 24 24" className="size-5 text-primary-foreground" fill="none" aria-hidden>
          <path
            d="M9 7.5a4.5 4.5 0 1 0 0 9M15 16.5a4.5 4.5 0 1 0 0-9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M9.5 12h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        GoldLink <span className="text-gradient-gold">AI</span>
      </span>
    </Link>
  );
}
