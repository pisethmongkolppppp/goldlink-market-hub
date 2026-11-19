import { Link } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/lib/nav";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            GoldLink AI brings gold and cryptocurrency markets together in one clear, beginner-friendly
            place. This is a design preview: no live market data is connected, and nothing here is
            financial advice.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3" aria-label="Footer">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="text-muted-foreground hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GoldLink AI · Preview build · Not financial advice
      </div>
    </footer>
  );
}
