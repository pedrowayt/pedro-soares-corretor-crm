"use client";

import { usePathname } from "next/navigation";
import { SiteWhatsAppBubble } from "@/components/public/site-whatsapp-bubble";
import { AttributionCapture } from "@/components/public/attribution-capture";
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
  const isYachtLanding = pathname === "/yacht-fama";
  const isYouLanding = pathname === "/you";
  const isTerracoUrbanLanding = pathname === "/terraco-urban";
  const isPalmasLakeLanding = pathname.startsWith("/palmas-lake");
  const isComodoroLanding = pathname === "/comodoro";
  const isUrbanHauteLanding = pathname === "/urban-haute";
  const isStandaloneLanding = isLakeVillageLanding || isQuintaDoLagoLanding || isAcordesLanding || isLike210Landing || isMaestriaLanding || isHeritageLanding || isYachtLanding || isYouLanding || isTerracoUrbanLanding || isPalmasLakeLanding || isComodoroLanding || isUrbanHauteLanding;
  const isInternalArea = pathname.startsWith("/admin") || pathname.startsWith("/crm");

  return (
    <>
      {!isInternalArea ? <AttributionCapture /> : null}
      {isStandaloneLanding ? null : <SiteHeader />}
      <main className={isStandaloneLanding ? "site-main--landing" : undefined}>{children}</main>
      {isStandaloneLanding ? null : <SiteFooter />}
      {isInternalArea ? null : <SiteWhatsAppBubble />}
    </>
  );
}
