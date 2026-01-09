import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPathActive(pathname: string, href: string) {
  // Normalize: remove trailing slash (except root)
  const normalize = (s: string) =>
    s.length > 1 ? s.replace(/\/dashboard/g, "").replace(/\//g, "") : s;

  const pathLastTwoSegments = pathname.split("/").slice(-2).join("")

  const p = normalize(pathLastTwoSegments)
  const h = normalize(href)

  console.log(p, h)

  // Check if pathname contains the href (simple substring match for "products" use case)
  return p.includes(h)
}
