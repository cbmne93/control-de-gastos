import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Control de gastos",
  description: "App web para controlar ingresos, gastos y vencimientos.",
};

type TemaPreferido = "CLARO" | "OSCURO" | "SISTEMA";
type ColorPrincipal = "TEAL" | "SKY" | "INDIGO" | "EMERALD";

const temasValidos: TemaPreferido[] = ["CLARO", "OSCURO", "SISTEMA"];
const coloresValidos: ColorPrincipal[] = ["TEAL", "SKY", "INDIGO", "EMERALD"];

function getTemaValido(value?: string): TemaPreferido {
  if (temasValidos.includes(value as TemaPreferido)) {
    return value as TemaPreferido;
  }

  return "CLARO";
}

function getColorValido(value?: string): ColorPrincipal {
  if (coloresValidos.includes(value as ColorPrincipal)) {
    return value as ColorPrincipal;
  }

  return "TEAL";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id;

  const cookieStore = await cookies();

  const cookieTema = getTemaValido(
    cookieStore.get("control-gastos-theme")?.value,
  );

  const cookieColor = getColorValido(
    cookieStore.get("control-gastos-accent")?.value,
  );

  const apariencia = userId
    ? await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        temaPreferido: true,
        colorPrincipal: true,
      },
    })
    : null;

  const temaPreferido = apariencia?.temaPreferido ?? cookieTema;
  const colorPrincipal = apariencia?.colorPrincipal ?? cookieColor;

  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body
        data-theme={temaPreferido}
        data-accent={colorPrincipal}
        className="flex min-h-full flex-col font-sans"
      >
        {children}
      </body>
    </html>
  );
}