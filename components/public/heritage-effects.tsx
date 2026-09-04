"use client";

import { useEffect } from "react";

export function HeritageEffects() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("heritage-js");

    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-heritage-reveal]"));
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -7%" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    let frame = 0;
    const updateScroll = () => {
      frame = 0;
      root.style.setProperty("--heritage-scroll", `${Math.min(window.scrollY, 900) * 0.12}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("heritage-js");
      root.style.removeProperty("--heritage-scroll");
    };
  }, []);

  return null;
}
