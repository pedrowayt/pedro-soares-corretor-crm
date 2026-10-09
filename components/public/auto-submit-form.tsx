"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormHTMLAttributes, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Debounce in ms applied to text/number/search inputs before auto-submitting. */
  debounceMs?: number;
  /** Keeps the mobile filter drawer stable until its explicit submit button is pressed. */
  manualOnMobile?: boolean;
} & FormHTMLAttributes<HTMLFormElement>;

/**
 * Wraps a GET form so it auto-submits whenever the user picks a new value.
 * Selects, chips, checkboxes and radios submit immediately on change; text and
 * numeric inputs are debounced so we don't navigate on every keystroke. Forms
 * with manualOnMobile wait for the explicit submit button on small screens.
 */
export function AutoSubmitForm({ children, debounceMs = 600, manualOnMobile = false, onChange, ...rest }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!manualOnMobile) return;

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [manualOnMobile]);

  const submit = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    formRef.current?.requestSubmit();
  };

  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    onChange?.(event);
    if (event.defaultPrevented) return;
    if (manualOnMobile && isMobile) return;

    const target = event.target as unknown as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const tag = target.tagName;

    if (tag === "SELECT") {
      submit();
      return;
    }

    if (tag === "INPUT") {
      const type = (target as HTMLInputElement).type;
      if (type === "checkbox" || type === "radio") {
        submit();
        return;
      }
      if (type === "hidden" || type === "submit" || type === "button") {
        return;
      }
      // text, number, search, etc. — debounce so we don't fire on every keystroke.
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(submit, debounceMs);
      return;
    }
  };

  return (
    <form ref={formRef} onChange={handleChange} {...rest}>
      {children}
    </form>
  );
}
