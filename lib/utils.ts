import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPathActive(pathname: string, href: string) {
  // Remove leading /dashboard (if present), preserving root as "/"
  const stripDashboard = (s: string) => {
    const stripped = s.replace(/^\/dashboard(?=\/|$)/, "")
    return stripped === "" ? "/" : stripped
  }

  // Normalize: remove trailing slash (except root)
  const normalize = (s: string) =>
    s.length > 1 ? s.replace(/\/+$/, "") : s

  const p = normalize(stripDashboard(pathname))
  const h = normalize(stripDashboard(href))

  console.log(p, h)

  // Exact match
  if (p === h) return true

  // Prefix match on segment boundary:
  // /products should match /products/123 but not /productivity
  return p.startsWith(h + "/")
}
