"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  ["#conceito", "O conceito"],
  ["#excelencia", "Excelência"],
  ["#video", "Vídeo"],
  ["#localizacao", "Localização"],
  ["#atendimento", "Atendimento"]
] as const;

export function HeritageNav() {
  return <HeritageNavInner />;
}

function HeritageNavInner() {
  const [open, setOpen] = useState(false);

  return (
    <header className="heritage-nav heritage-container">
      <a href="#inicio" aria-label="Heritage Fama" className="heritage-logo-wrap" onClick={() => setOpen(false)}>
        <Image src="/heritage/logo-original.png" alt="Heritage Fama powered by Porsche Consulting" width={186} height={233} className="heritage-logo" />
      </a>
      <button type="button" className="heritage-menu-toggle" aria-expanded={open} aria-controls="heritage-navigation" onClick={() => setOpen((value) => !value)}>
        {open ? <X size={18} /> : <Menu size={18} />}<span>{open ? "Fechar" : "Menu"}</span>
      </button>
      <nav id="heritage-navigation" className={`heritage-navigation${open ? " is-open" : ""}`} aria-label="Navegação principal">
        {links.map(([href, label]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <a href="#atendimento" className="heritage-button heritage-button--outline heritage-button--nav" onClick={() => setOpen(false)}>Receber apresentação <ArrowRight size={15} /></a>
    </header>
  );
}
