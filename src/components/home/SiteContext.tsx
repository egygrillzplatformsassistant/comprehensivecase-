"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Lang, Texts } from "@/lib/types";

const STORAGE_KEY = "asu.lang";

type SiteCtxValue = {
  lang: Lang;
  choose: (l: Lang) => void;
  chosen: boolean;
  t: (key: string) => string;
  items: Map<string, CartItem>;
  toggle: (item: CartItem) => void;
  remove: (key: string) => void;
  clear: () => void;
  total: number;
  count: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const SiteCtx = createContext<SiteCtxValue | null>(null);

export function SiteProvider({
  texts,
  children,
}: {
  texts: Texts;
  children: ReactNode;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [chosen, setChosen] = useState(false);
  const [items, setItems] = useState<Map<string, CartItem>>(new Map());
  const [cartOpen, setCartOpen] = useState(false);

  /* restore saved language once mounted */
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") {
      setLang(saved);
      setChosen(true);
    }
  }, []);

  /* keep <html lang/dir> in sync */
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    if (chosen) window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, chosen]);

  const choose = useCallback((l: Lang) => {
    setLang(l);
    setChosen(true);
  }, []);

  const t = useCallback(
    (key: string) => texts[key]?.[lang] ?? "",
    [texts, lang],
  );

  const toggle = useCallback((item: CartItem) => {
    setItems((prev) => {
      const next = new Map(prev);
      if (next.has(item.key)) next.delete(item.key);
      else next.set(item.key, item);
      return next;
    });
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems(new Map()), []);

  const { total, count } = useMemo(() => {
    let sum = 0;
    items.forEach((i) => (sum += i.price));
    return { total: sum, count: items.size };
  }, [items]);

  const value: SiteCtxValue = {
    lang,
    choose,
    chosen,
    t,
    items,
    toggle,
    remove,
    clear,
    total,
    count,
    cartOpen,
    setCartOpen,
  };

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteCtx);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
