"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLakeVillageLanding = pathname === "/lake-village";
  const isQuintaDoLagoLanding = pathname === "/quinta-do-lago";
  const isAcordesLanding = pathname === "/acordes";
  const isLike210Landing = pathname === "/like-210";
  const isStandaloneLanding = isLakeVillageLanding || isQuintaDoLagoLanding || isAcordesLanding || isLike210Landing;

  return (
    <>
      {isStandaloneLanding ? null : <SiteHeader />}
      <main className={isStandaloneLanding ? "site-main--landing" : undefined}>{children}</main>
      {isStandaloneLanding ? null : <SiteFooter />}
    </>
  );
}
