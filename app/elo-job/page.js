"use client";

import { useEffect } from "react";

export const metadata = {
  title: "Elo Job LoL - Subir de Elo Rápido e Seguro",
  description:
    "Elo Job LoL com boosters profissionais. Suba de elo rápido e seguro.",
};

export default function Page() {
  useEffect(() => {
    window.location.replace("/#calculadora");
  }, []);

  return null;
}
