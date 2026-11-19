export const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/gold", label: "Gold Prices" },
  { to: "/crypto", label: "Crypto Prices" },
  { to: "/converter", label: "Converter" },
  { to: "/assistant", label: "AI Assistant" },
] as const;

export const FOOTER_ITEMS = [
  ...NAV_ITEMS.slice(1),
  { to: "/charts", label: "Charts" },
  { to: "/exchange", label: "Exchange Demo" },
] as const;
