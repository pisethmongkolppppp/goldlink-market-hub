import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowRightLeft,
  BarChart3,
  Bot,
  Coins,
  LineChart,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChartLegend, IllustrativeChart } from "@/components/site/IllustrativeChart";
import { Section } from "@/components/site/PageHeader";
import { AssetIcon, PriceTile } from "@/components/site/PriceTile";
import { StatusBadge } from "@/components/site/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoldLink AI — Where gold meets crypto" },
      {
        name: "description",
        content:
          "Track gold, Bitcoin and Ethereum side by side, convert crypto to gold, compare charts and practice trading in a safe demo.",
      },
      { property: "og:title", content: "GoldLink AI — Where gold meets crypto" },
      {
        property: "og:description",
        content: "One beginner-friendly platform for gold and cryptocurrency markets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { to: "/gold", icon: Coins, title: "Gold dashboard", text: "Spot price per ounce, gram and kilogram, explained simply." },
  { to: "/crypto", icon: LineChart, title: "Bitcoin & Ethereum", text: "The two largest cryptocurrencies, in one calm view." },
  { to: "/converter", icon: ArrowRightLeft, title: "Crypto-to-gold converter", text: "See how much gold your crypto would equal." },
  { to: "/charts", icon: BarChart3, title: "Comparison charts", text: "Put gold and crypto on the same chart to compare." },
  { to: "/assistant", icon: Bot, title: "AI assistant", text: "Ask plain-language questions about gold and crypto." },
  { to: "/exchange", icon: Wallet, title: "Exchange demo", text: "Practise buying and selling with virtual money only." },
] as const;

const STEPS = [
  { n: "01", title: "Look", text: "Check gold and crypto on one screen, without jumping between apps." },
  { n: "02", title: "Compare", text: "Line them up on shared charts and convert one into the other." },
  { n: "03", title: "Practise", text: "Try trades in the demo exchange before risking anything real." },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pt-24">
          <div className="animate-rise">
            <StatusBadge tone="demo">
              <Sparkles className="size-3" /> Design preview
            </StatusBadge>
            <h1 className="mt-6 text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
              Connect Digital Assets with <span className="text-gradient-gold italic">Real Gold Value.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Compare cryptocurrency and gold prices in one place. See Bitcoin, Ethereum and gold side
              by side, and find out what your digital assets are worth in real gold.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="xl">
                <Link to="/converter">
                  Start Converting <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="goldOutline" size="xl">
                <Link to="/gold">View gold prices</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Built for beginners</li>
              <li className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> No real money in demos</li>
              <li className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Clear, honest data labels</li>
            </ul>
          </div>

          <div className="panel relative animate-rise p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Market overview</p>
              <StatusBadge>Live data not connected</StatusBadge>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {([
                ["gold", "Gold", "XAU"],
                ["btc", "Bitcoin", "BTC"],
                ["eth", "Ethereum", "ETH"],
              ] as const).map(([a, name, sym]) => (
                <div key={a} className="rounded-lg border border-border bg-background/40 p-3">
                  <AssetIcon asset={a} />
                  <p className="mt-3 text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{sym}</p>
                  <p className="tabular mt-2 text-lg text-foreground/40">— —</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-border bg-background/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <ChartLegend keys={["gold", "btc", "eth"]} />
                <StatusBadge tone="sample">Illustrative</StatusBadge>
              </div>
              <IllustrativeChart keys={["gold", "btc", "eth"]} height={200} seed={2} />
            </div>
          </div>
        </div>
      </section>

      <Section className="py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Market prices</p>
            <h2 className="text-3xl font-medium sm:text-4xl">Bitcoin, Ethereum and Gold.</h2>
          </div>
          <StatusBadge>Placeholders · prices appear once data is connected</StatusBadge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <PriceTile label="Bitcoin" symbol="BTC / USD" icon={<AssetIcon asset="btc" />} note="Price placeholder" />
          <PriceTile label="Ethereum" symbol="ETH / USD" icon={<AssetIcon asset="eth" />} note="Price placeholder" />
          <PriceTile label="Gold" symbol="XAU / USD · per oz t" icon={<AssetIcon asset="gold" />} note="Price placeholder" />
        </div>
      </Section>

      <Section className="py-16">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Everything in one place</p>
          <h2 className="text-3xl font-medium sm:text-4xl">Six simple tools, one clear platform.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="panel group flex flex-col gap-4 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <span className="grid size-11 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="text-xl font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <div className="panel grid gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
            <h2 className="text-3xl font-medium">Start in three steps.</h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="border-l border-primary/40 pl-5">
                <span className="tabular text-sm text-primary">{s.n}</span>
                <h3 className="mt-2 text-xl font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="py-16">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-gold opacity-[0.08]" aria-hidden />
          <h2 className="relative text-3xl font-medium sm:text-4xl">
            Learn the markets <span className="text-gradient-gold italic">without the risk.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            The exchange demo uses virtual money and prices you set yourself — a safe place to see how
            buying and selling works.
          </p>
          <Button asChild variant="gold" size="xl" className="relative mt-8">
            <Link to="/exchange">
              Open the demo <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
