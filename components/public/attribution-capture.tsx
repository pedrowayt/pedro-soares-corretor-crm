"use client";

import { useEffect } from "react";
import { getPublicAttribution } from "@/lib/attribution";

export function AttributionCapture() {
  useEffect(() => {
    getPublicAttribution();
  }, []);

  return null;
}
