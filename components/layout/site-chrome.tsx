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
  const isMaestriaLanding = pathname === "/maestria";
  const isHeritageLanding = pathname === "/heritage";
  const isYouLanding = pathname === "/you";
  const isTerracoUrbanLanding = pathname === "/terraco-urban";
  const isPalmasLakeLanding = pathname.startsWith("/palmas-lake");
  const isComodoroLanding = pathname === "/comodoro";
  const isStandaloneLanding = isLakeVillageLanding || isQuintaDoLagoLanding || isAcordesLanding || isLike210Landing || isMaestriaLanding || isHeritageLanding || isYouLanding || isTerracoUrbanLanding || isPalmasLakeLanding || isComodoroLanding;

  return (
    <>
      {isStandaloneLanding ? null : <SiteHeader />}
      <main className={isStandaloneLanding ? "site-main--landing" : undefined}>{children}</main>
      {isStandaloneLanding ? null : <SiteFooter />}
    </>
  );
}
