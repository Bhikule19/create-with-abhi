"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Ctx = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const MenuContext = createContext<Ctx | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);
  return (
    <MenuContext.Provider value={{ open, toggle, close }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}
