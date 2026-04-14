"use client";

import { useEffect } from "react";

export const metadata = {
  title: "Elo Job LoL - Subir de Elo Rápido e Seguro",
  description:
    "Serviço de Elo Job LoL barato e seguro. Suba de elo com boosters profissionais.",
};

export default function Page() {
  useEffect(() => {
    window.location.replace("/#calculadora");
  }, []);

  return null;
}
