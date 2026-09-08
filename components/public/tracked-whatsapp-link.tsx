"use client";

import { getPublicAttribution } from "@/lib/attribution";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  landingPageSlug?: string;
  messageTemplate?: string;
};

export function TrackedWhatsAppLink({ landingPageSlug, messageTemplate, onClick, ...props }: Props) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    void fetch("/api/public/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        landingPageSlug,
        messageTemplate,
        sourcePage: window.location.pathname,
        attribution: getPublicAttribution()
      })
    }).catch(() => undefined);
  }

  return <a {...props} onClick={handleClick} />;
}
