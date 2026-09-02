"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLakeVillageLanding = pathname === "/lake-village";

  return (
    <>
      {isLakeVillageLanding ? null : <SiteHeader />}
      <main className={isLakeVillageLanding ? "site-main--landing" : undefined}>{children}</main>
      {isLakeVillageLanding ? null : <SiteFooter />}
    </>
  );
}
