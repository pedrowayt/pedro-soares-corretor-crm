import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";

const items = {
  "lake-sky": { name: "Lake Sky", group: "Residencial", year: "2032", image: "sky-hero", title: "Máxima exclusividade", description: "Coberturas duplex e mansões suspensas com vista permanente para o lago — o produto de maior padrão do complexo.", specs: ["331,29 a 662,58 m²", "4 suítes", "4 a 6 vagas", "Piscina interna e cinema"] },
  "lake-garden": { name: "Lake Garden", group: "Residencial", year: "2032", image: "garden-tower", title: "Alto luxo residencial.", description: "Dois apartamentos por andar, amplos e desenhados para famílias que buscam espaço e sofisticação à beira do lago.", specs: ["222,70 m²", "2 apartamentos por andar", "3 ou 4 suítes", "3 vagas de garagem"] },
  "lake-park": { name: "Lake Park", group: "Residencial", year: "2032", image: "park-tower", title: "Conforto residencial amplo.", description: "Três apartamentos por andar, plantas flexíveis e o melhor ponto de entrada entre as torres residenciais do complexo.", specs: ["189,25 a 191,51 m²", "3 suítes", "2 vagas", "Living integrado"] },
  "lake-loft": { name: "Lake Loft", group: "Multifuncional", year: "2029", image: "lake-loft-hero", title: "Moradia ou hospedagem temporária.", description: "160 unidades compactas e inteligentes, preparadas tanto para moradia permanente quanto para hospedagem temporária — um produto flexível para viver ou investir.", specs: ["44,51 a 57,98 m²", "1 ou 2 dormitórios", "1 vaga", "160 lofts"] },
  "lake-office": { name: "Lake Office", group: "Business Center", year: "2029", image: "office", title: "Seu próximo endereço profissional.", description: "Salas compactas e amplas lajes corporativas onde é possível trabalhar e viver no mesmo endereço, com acesso direto ao Mall.", specs: ["52,04 a 509,85 m²", "222 salas", "Estacionamento rotativo", "Rooftop e heliponto"] },
  "lake-mall": { name: "Lake Mall", group: "Shopping conceito", year: "2029", image: "lake-mall-facade", title: "O coração de convívio.", description: "Uma torre multifuncional com 32 lojas exclusivas de gastronomia e serviços, rooftop social e integração com a Marina e as torres do complexo.", specs: ["42,49 a 631,77 m²", "32 lojas exclusivas", "Gastronomia e serviços", "Rooftop social e heliponto"] }
} as const;

const skyHighlights = [
  ["Área privativa", "331,29 m² a 662,58 m²"],
  ["Suítes", "4 suítes"],
  ["Vagas", "4 a 6 vagas privativas"],
  ["Diferencial", "Piscina interna e cinema"],
] as const;

const skyLeisure = [
  "Living superior de 172,97 m² na cobertura",
  "Salão de festas e salão gourmet",
  "Espaço fitness, sala de jogos e espaço beauty",
  "Elevador delivery e piscina exclusiva",
  "Brinquedoteca, acesso e vagas para carro elétrico",
] as const;

const skyGallery = [
  ["sky-interiors-01.jpg", "Living com piscina interna e vista para o lago"],
  ["sky-interiors-02.jpg", "Living superior com varanda e vista permanente"],
] as const;

const skyUnits = [
  ["30", "Apto 2900/3000", "662,58 m²", "Reservado"],
  ["28", "Apto 2800", "331,29 m²", "Reservado"],
  ["27", "Apto 2700", "331,29 m²", "Disponível"],
  ["26", "Apto 2600", "331,29 m²", "Vendido"],
  ["25", "Apto 2500", "331,29 m²", "Disponível"],
  ["24", "Apto 2400", "331,29 m²", "Disponível"],
  ["23", "Apto 2300", "331,29 m²", "Disponível"],
  ["22", "Apto 2200", "331,29 m²", "Reservado"],
  ["21", "Apto 2100", "331,29 m²", "Disponível"],
  ["20", "Apto 2000", "331,29 m²", "Disponível"],
  ["19", "Apto 1900", "331,29 m²", "Disponível"],
  ["18", "Apto 1800", "331,29 m²", "Reservado"],
  ["17", "Apto 1700", "331,29 m²", "Disponível"],
  ["16", "Apto 1600", "331,29 m²", "Disponível"],
  ["15", "Apto 1500", "331,29 m²", "Disponível"],
  ["14", "Apto 1400", "331,29 m²", "Disponível"],
  ["13", "Apto 1300", "332,29 m²", "Vendido"],
  ["12", "Apto 1200", "331,29 m²", "Disponível"],
  ["11", "Apto 1100", "331,29 m²", "Disponível"],
  ["10", "Apto 1000", "331,29 m²", "Disponível"],
  ["9", "Apto 900", "331,29 m²", "Disponível"],
  ["8", "Apto 800", "331,29 m²", "Disponível"],
  ["7", "Apto 700", "331,29 m²", "Disponível"],
  ["6", "Apto 600", "331,29 m²", "Disponível"],
  ["5", "Apto 500", "331,29 m²", "Disponível"],
  ["4", "Apto 400", "331,29 m²", "Disponível"],
  ["3", "Apto 300", "331,29 m²", "Disponível"],
  ["2", "Apto 200", "331,29 m²", "Vendido"],
] as const;

const gardenHighlights = [
  ["Área privativa", "222,70 m²"],
  ["Unidades por andar", "2 apartamentos"],
  ["Suítes", "3 ou 4 suítes"],
  ["Vagas", "3 vagas de garagem"],
] as const;

const gardenLeisure = [
  "Suíte master com hidromassagem",
  "Sala de estar integrada",
  "Salão de festas",
  "Espaço fitness",
  "Acesso ao Beach Club e à Marina",
  "Paisagismo exuberante",
] as const;

const gardenGallery = [
  ["garden-tower.webp", "A fachada da torre Lake Garden"],
  ["garden-interiors.webp", "Ambientes amplos com interiores sugeridos"],
] as const;

const gardenPlans = [
  ["garden-plan-3-suites.jpg", "Planta Garden com 3 suítes", "3 suítes · 222,70 m² · 3 vagas"],
  ["garden-plan-4-suites.jpg", "Planta Garden com 4 suítes", "4 suítes · 222,70 m² · 3 vagas"],
] as const;

const gardenUnits = Array.from({ length: 30 }, (_, index) => {
  const floor = 30 - index;
  return [String(floor), `Apto ${floor}01 / ${floor}02`, "222,70 m²"] as const;
});

const parkHighlights = [
  ["Área privativa", "189,25 a 191,51 m²"],
  ["Unidades por andar", "3 apartamentos"],
  ["Suítes", "3 suítes"],
  ["Vagas", "2 vagas por unidade"],
] as const;

const parkLeisure = [
  "Living integrado com lavabo",
  "Lavanderia independente",
  "Salão de festas",
  "Espaço fitness",
  "Acesso ao Beach Club e à Marina",
  "Paisagismo exuberante",
] as const;

const parkGallery = [
  ["park-tower.webp", "A fachada da torre Lake Park"],
  ["park-interiors.webp", "Interiores sugeridos para a torre"],
] as const;

const parkUnitFloors = [
  ["30", [["3003", "191,51 m²", "R$ 4.504.315,20", "Disponível"], ["3002", "190,85 m²", "R$ 4.488.792,00", "Disponível"], ["3001", "189,25 m²", "R$ 4.530.645,00", "Disponível"]]],
  ["29", [["2903", "191,51 m²", "R$ 4.423.881,00", "Disponível"], ["2902", "190,85 m²", "R$ 4.408.635,00", "Disponível"], ["2901", "189,25 m²", "R$ 4.451.160,00", "Disponível"]]],
  ["28", [["2803", "191,51 m²", "R$ 4.383.663,90", "Disponível"], ["2802", "190,85 m²", "R$ 4.368.556,50", "Disponível"], ["2801", "189,25 m²", "R$ 4.411.417,50", "Disponível"]]],
  ["27", [["2703", "191,51 m²", "R$ 4.383.663,90", "Disponível"], ["2702", "190,85 m²", "R$ 4.368.556,50", "Disponível"], ["2701", "189,25 m²", "R$ 4.411.417,50", "Disponível"]]],
  ["26", [["2603", "191,51 m²", "R$ 4.383.663,90", "Vendido"], ["2602", "190,85 m²", "R$ 4.368.556,50", "Disponível"], ["2601", "189,25 m²", "R$ 4.411.417,50", "Disponível"]]],
  ["25", [["2503", "191,51 m²", "R$ 4.343.446,80", "Disponível"], ["2502", "190,85 m²", "R$ 4.328.478,00", "Disponível"], ["2501", "189,25 m²", "R$ 4.371.675,00", "Disponível"]]],
  ["24", [["2403", "191,51 m²", "R$ 4.343.446,80", "Disponível"], ["2402", "190,85 m²", "R$ 4.328.478,00", "Disponível"], ["2401", "189,25 m²", "R$ 4.371.675,00", "Disponível"]]],
  ["23", [["2303", "191,51 m²", "R$ 4.343.446,80", "Vendido"], ["2302", "190,85 m²", "R$ 4.328.478,00", "Vendido"], ["2301", "189,25 m²", "R$ 4.371.675,00", "Disponível"]]],
  ["22", [["2203", "191,51 m²", "R$ 4.343.446,80", "Disponível"], ["2202", "190,85 m²", "R$ 4.328.478,00", "Disponível"], ["2201", "189,25 m²", "R$ 4.371.675,00", "Disponível"]]],
  ["21", [["2103", "191,51 m²", "R$ 4.303.229,70", "Disponível"], ["2102", "190,85 m²", "R$ 4.288.399,50", "Disponível"], ["2101", "189,25 m²", "R$ 4.331.932,50", "Disponível"]]],
  ["20", [["2003", "191,51 m²", "R$ 4.303.229,70", "Disponível"], ["2002", "190,85 m²", "R$ 4.288.399,50", "Disponível"], ["2001", "189,25 m²", "R$ 4.331.932,50", "Disponível"]]],
  ["19", [["1903", "191,51 m²", "R$ 4.303.229,70", "Disponível"], ["1902", "190,85 m²", "R$ 4.288.399,50", "Disponível"], ["1901", "189,25 m²", "R$ 4.331.932,50", "Disponível"]]],
  ["18", [["1803", "191,51 m²", "R$ 4.303.229,70", "Disponível"], ["1802", "190,85 m²", "R$ 4.288.399,50", "Disponível"], ["1801", "189,25 m²", "R$ 4.331.932,50", "Vendido"]]],
  ["17", [["1703", "191,51 m²", "R$ 4.263.012,60", "Disponível"], ["1702", "190,85 m²", "R$ 4.248.321,00", "Disponível"], ["1701", "189,25 m²", "R$ 4.292.190,00", "Disponível"]]],
  ["16", [["1603", "191,51 m²", "R$ 4.263.012,60", "Disponível"], ["1602", "190,85 m²", "R$ 4.248.321,00", "Disponível"], ["1601", "189,25 m²", "R$ 4.292.190,00", "Disponível"]]],
  ["15", [["1503", "191,51 m²", "R$ 4.263.012,60", "Disponível"], ["1502", "190,85 m²", "R$ 4.248.321,00", "Disponível"], ["1501", "189,25 m²", "R$ 4.292.190,00", "Disponível"]]],
  ["14", [["1403", "191,51 m²", "R$ 4.263.012,60", "Vendido"], ["1402", "190,85 m²", "R$ 4.248.321,00", "Vendido"], ["1401", "189,25 m²", "R$ 4.292.190,00", "Disponível"]]],
  ["13", [["1303", "191,51 m²", "R$ 4.222.795,50", "Disponível"], ["1302", "190,85 m²", "R$ 4.208.242,50", "Disponível"], ["1301", "189,25 m²", "R$ 4.252.447,50", "Disponível"]]],
  ["12", [["1203", "191,51 m²", "R$ 4.222.795,50", "Disponível"], ["1202", "190,85 m²", "R$ 4.208.242,50", "Disponível"], ["1201", "189,25 m²", "R$ 4.252.447,50", "Disponível"]]],
  ["11", [["1103", "191,51 m²", "R$ 4.222.795,50", "Disponível"], ["1102", "190,85 m²", "R$ 4.208.242,50", "Disponível"], ["1101", "189,25 m²", "R$ 4.252.447,50", "Disponível"]]],
  ["10", [["1003", "191,51 m²", "R$ 4.222.795,50", "Disponível"], ["1002", "190,85 m²", "R$ 4.208.242,50", "Disponível"], ["1001", "189,25 m²", "R$ 4.252.447,50", "Vendido"]]],
  ["9", [["903", "191,51 m²", "R$ 4.182.578,40", "Disponível"], ["902", "190,85 m²", "R$ 4.168.164,00", "Vendido"], ["901", "189,25 m²", "R$ 4.212.705,00", "Disponível"]]],
  ["8", [["803", "191,51 m²", "R$ 4.182.578,40", "Disponível"], ["802", "190,85 m²", "R$ 4.168.164,00", "Disponível"], ["801", "189,25 m²", "R$ 4.212.705,00", "Disponível"]]],
  ["7", [["703", "191,51 m²", "R$ 4.182.578,40", "Disponível"], ["702", "190,85 m²", "R$ 4.168.164,00", "Disponível"], ["701", "189,25 m²", "R$ 4.212.705,00", "Disponível"]]],
  ["6", [["603", "191,51 m²", "R$ 4.182.578,40", "Disponível"], ["602", "190,85 m²", "R$ 4.168.164,00", "Disponível"], ["601", "189,25 m²", "R$ 4.212.705,00", "Disponível"]]],
  ["5", [["503", "191,51 m²", "R$ 4.182.578,40", "Vendido"], ["502", "190,85 m²", "R$ 4.168.164,00", "Vendido"], ["501", "189,25 m²", "R$ 4.212.705,00", "Disponível"]]],
  ["4", [["403", "191,51 m²", "R$ 4.021.710,00", "Selecionada"], ["402", "190,85 m²", "R$ 4.007.850,00", "Selecionada"], ["401", "189,25 m²", "R$ 4.053.735,00", "Selecionada"]]],
  ["3", [["303", "191,51 m²", "R$ 4.021.710,00", "Disponível"], ["302", "190,85 m²", "R$ 4.007.850,00", "Disponível"], ["301", "189,25 m²", "R$ 4.053.735,00", "Disponível"]]],
  ["2", [["203", "191,51 m²", "R$ 4.021.710,00", "Disponível"], ["202", "190,85 m²", "R$ 4.007.850,00", "Disponível"], ["201", "189,25 m²", "R$ 4.053.735,00", "Disponível"]]],
  ["1", [["103", "191,51 m²", "R$ 4.021.710,00", "Disponível"], ["102", "190,85 m²", "R$ 4.007.850,00", "Vendido"], ["101", "189,25 m²", "R$ 4.053.735,00", "Disponível"]]],
] as const;

const parkUnits = parkUnitFloors.flatMap(([floor, units]) => units.map(([unit, area, value, status]) => [floor, `Apto ${unit}`, area, value, status] as const));

function parkStatusClass(status: string) {
  return status === "Disponível" ? "palmas-sky-status--available" : status === "Vendido" ? "palmas-sky-status--sold" : "palmas-sky-status--selected";
}

const mallHighlights = [
  ["Área das lojas", "42,49 a 631,77 m²"],
  ["Total de lojas", "32 lojas exclusivas"],
  ["Uso", "Gastronomia e serviços"],
  ["Diferencial", "Rooftop social e heliponto"],
] as const;

const mallGallery = [
  ["mall.jpg", "Parte interna do Lake Mall"],
  ["lake-mall-events.jpg", "Salão de eventos com vista para Palmas"],
  ["lake-mall-facade.jpg", "Fachada oficial do Lake Mall"],
] as const;

const mallExperiences = [
  "Praça de alimentação com vocação gastronômica",
  "Rooftop social para encontros e celebrações",
  "Salão de eventos com vista para a cidade",
  "Acesso direto às torres Loft, Office e residenciais",
  "Integração com a Marina e as áreas de lazer",
  "Lojas planejadas para serviços e experiências exclusivas",
] as const;

const loftHighlights = [
  ["Área privativa", "44,51 a 57,98 m²"],
  ["Dormitórios", "1 ou 2 dormitórios"],
  ["Vagas", "1 vaga de garagem"],
  ["Total de unidades", "160 lofts"],
] as const;

const loftGallery = [
  ["market", "Market de conveniência", "Praticidade para resolver o dia a dia sem sair da torre."],
  ["laundry", "Laundry Express", "Lavanderia compartilhada para uma rotina mais leve — inclusive para hospedagens temporárias."],
  ["hall", "Hall de recepção e convivência", "Um ambiente acolhedor para chegar, trabalhar, encontrar e permanecer."],
] as const;

const loftPlans = [
  ["lake-loft-5-pavimento.jpg", "Planta do 5º pavimento", "Lofts, salas comerciais e áreas de convivência no mesmo layout."],
  ["lake-loft-tipo-02.jpg", "Loft tipo 02", "Planta com dois dormitórios, sala integrada, cozinha e varanda."],
] as const;

const loftLeisure = [
  "Área de lazer completa",
  "Piscina externa",
  "Salão de festas com churrasqueira",
  "Laundry Express",
  "Market de conveniência",
  "Academia",
  "Rooftop social",
  "Espaço beauty / maquiagem",
] as const;

const officeHighlights = [
  ["Área privativa", "52,04 a 509,85 m²"],
  ["Total de unidades", "222 salas"],
  ["Estacionamento", "Rotativo"],
  ["Acesso", "Direto ao Mall"],
] as const;

const officeGallery = [
  ["office.jpg", "Interiores sugeridos para trabalhar com vista para o lago"],
  ["office-gallery.jpg", "Salas de reunião e ambientes corporativos"],
] as const;

const officePlans = [
  ["office-plan-01.jpg", "Planta tipo 01", "Solução corporativa ampla para receber, reunir e operar com mais presença."],
  ["office-plan-02.jpg", "Planta tipo 02", "Layout versátil para uma operação profissional mais compacta e eficiente."],
] as const;

const officeSizeBands = [
  ["Salas compactas", "52,04 m² · 52,30 m² · 53,34 m²", "Para operações enxutas, consultórios e escritórios de entrada."],
  ["Salas padrão", "60,65 m² · 61,31 m² · 64,88 m² · 65,61 m² · 65,87 m² · 66,50 m²", "Mais área para equipes, atendimento e ambientes corporativos completos."],
  ["Sala ampliada", "77,70 m²", "Uma configuração com mais liberdade para layout, reunião e expansão."],
  ["Laje corporativa", "509,85 m²", "A maior escala do espelho para uma operação corporativa com identidade própria."],
] as const;

type Slug = keyof typeof items;
export function generateStaticParams() { return Object.keys(items).map((slug) => ({ slug })); }
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const item = items[slug as Slug];
    return item ? { title: `${item.name} | Palmas Lake`, description: `${item.title} Conheça o ${item.name}, parte do complexo Palmas Lake.` } : { title: "Palmas Lake" };
  });
}

export default async function PalmasLakeDevelopmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = items[slug as Slug];
  if (!item) return null;
  const isSky = slug === "lake-sky";
  const isGarden = slug === "lake-garden";
  const isPark = slug === "lake-park";
  const isMall = slug === "lake-mall";
  const isLoft = slug === "lake-loft";
  const isOffice = slug === "lake-office";
  const heroImage = isOffice ? "office-hero" : item.image;
  const whatsappHref = `https://wa.me/5563984845101?text=${encodeURIComponent(`Olá Pedro, quero conhecer o ${item.name}.`)}`;
  return <div className="palmas-detail-page">
    <div className={`palmas-detail-hero${isGarden ? " palmas-detail-hero--garden" : ""}${isPark ? " palmas-detail-hero--park" : ""}${isMall ? " palmas-detail-hero--mall" : ""}${isLoft ? " palmas-detail-hero--loft" : ""}${isOffice ? " palmas-detail-hero--office" : ""}`}><Image src={`/brand/palmas-lake/${heroImage}.${isGarden || isPark ? "webp" : "jpg"}`} alt={`Imagem do ${item.name}`} fill priority sizes="100vw" /><div className="palmas-detail-overlay" /><div className="palmas-detail-top"><Link href="/palmas-lake" className="palmas-detail-back"><ArrowLeft size={16} /> Palmas Lake</Link><span>{isMall || isLoft || isOffice ? "Torre multifuncional" : item.group} · entrega {item.year}</span></div><div className="palmas-detail-hero-copy"><p>{isMall ? "Shopping conceito" : isLoft ? "Moradia ou hospedagem temporária" : isOffice ? "Business center" : "Uma experiência Palmas Lake"}</p><h1>{item.name}</h1><h2>{item.title}</h2></div></div>
    <main className="palmas-detail-main"><div className="palmas-detail-copy"><p className="palmas-lake-kicker">{isMall || isLoft || isOffice ? "Torre multifuncional" : "Torre residencial"} · entrega {item.year}</p><h2>{item.title}</h2><p>{item.description}</p><a className="palmas-lake-button palmas-lake-button--gold" href={whatsappHref} target="_blank" rel="noreferrer">Conhecer esta experiência <ArrowUpRight size={17} /></a></div><div className="palmas-detail-specs">{item.specs.map((spec, index) => <div key={spec}><span>0{index + 1}</span><strong>{spec}</strong></div>)}</div></main>
    {isLoft && <>
      <section className="palmas-sky-highlights palmas-loft-highlights" aria-label="Características do Lake Loft"><div className="palmas-sky-container palmas-sky-highlights-grid">{loftHighlights.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="palmas-sky-story palmas-loft-story"><div className="palmas-sky-container palmas-sky-story-grid"><div><p className="palmas-lake-kicker">Lake Loft · torre multifuncional</p><h2>Um endereço que acompanha o seu momento.</h2></div><div><p>O Lake Loft combina a eficiência de uma unidade compacta com a estrutura de um destino completo. É uma solução para quem quer morar perto do lago, receber por temporada ou manter as duas possibilidades abertas.</p><p>Com entrega prevista para 2029, o projeto reúne moradia, hospedagem temporária e serviços em uma mesma experiência — com fácil acesso ao restante do Palmas Lake.</p></div></div></section>
      <section className="palmas-sky-plan palmas-loft-plans" id="plantas" aria-labelledby="palmas-loft-plans-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Plantas e layout</p><h2 id="palmas-loft-plans-title">Escolha a configuração que faz sentido para você.</h2><p>Veja a distribuição do 5º pavimento e conheça uma das opções de planta do Loft.</p></div><div className="palmas-loft-plans-grid">{loftPlans.map(([src, title, text]) => <figure className="palmas-loft-plan-card" key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={title} fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized /></div><figcaption><strong>{title}</strong><span>{text}</span></figcaption></figure>)}</div></div></section>
      <section className="palmas-sky-gallery palmas-loft-gallery" aria-labelledby="palmas-loft-gallery-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Serviços da torre</p><h2 id="palmas-loft-gallery-title">Tudo o que deixa a rotina mais simples.</h2><p>As áreas comuns foram pensadas para dar autonomia, conveniência e uma experiência mais completa para moradores e hóspedes.</p></div><div className="palmas-loft-gallery-grid">{loftGallery.map(([position, title, text]) => <figure className={`palmas-loft-gallery-card palmas-loft-gallery-card--${position}`} key={position}><div><Image src="/brand/palmas-lake/loft.jpg" alt={title} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><figcaption><strong>{title}</strong><span>{text}</span></figcaption></figure>)}</div></div></section>
      <section className="palmas-sky-leisure palmas-loft-leisure"><div className="palmas-sky-container palmas-sky-leisure-grid"><div><p className="palmas-lake-kicker">Lazer da torre</p><h2>Estrutura para viver, receber e investir.</h2><p className="palmas-loft-leisure-intro">Uma seleção de ambientes que amplia o valor de uso do loft e torna a operação mais prática para quem busca renda por hospedagem.</p></div><div className="palmas-sky-leisure-list">{loftLeisure.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><strong>{feature}</strong></div>)}</div></div></section>
      <section className="palmas-sky-plan palmas-loft-cta" id="condicoes" aria-labelledby="palmas-loft-cta-title"><div className="palmas-sky-container palmas-loft-cta-inner"><div><p className="palmas-lake-kicker">Lake Loft · entrega 2029</p><h2 id="palmas-loft-cta-title">Quer entender se o loft combina com o seu plano?</h2><p>Receba plantas, disponibilidade e condições atualizadas para moradia ou investimento.</p></div><a className="palmas-lake-button palmas-lake-button--gold" href={whatsappHref} target="_blank" rel="noreferrer">Receber plantas e condições <ArrowUpRight size={17} /></a></div></section>
    </>}
    {isSky && <>
      <section className="palmas-sky-highlights" aria-label="Características do Lake Sky"><div className="palmas-sky-container palmas-sky-highlights-grid">{skyHighlights.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="palmas-sky-story"><div className="palmas-sky-container palmas-sky-story-grid"><div><p className="palmas-lake-kicker">Lake Sky</p><h2>O topo do Palmas Lake.</h2></div><div><p>Coberturas duplex e mansões suspensas desenhadas para quem procura o ponto mais alto de sofisticação, privacidade e contemplação do lago.</p><p>Com um apartamento por andar, o Lake Sky combina escala generosa, interiores luminosos e uma experiência de lazer exclusiva dentro da própria torre.</p></div></div></section>
      <section className="palmas-sky-gallery"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Uma torre para viver por inteiro</p><h2>Vista, água e arquitetura em todos os ambientes.</h2></div><div className="palmas-sky-gallery-grid">{skyGallery.map(([src, alt]) => <figure key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>{alt}</figcaption></figure>)}</div></div></section>
      <section className="palmas-sky-plan"><div className="palmas-sky-container palmas-sky-plan-grid"><div className="palmas-sky-plan-image"><Image src="/brand/palmas-lake/sky-duplex.jpg" alt="Planta da cobertura duplex Lake Sky" fill sizes="(max-width: 900px) 100vw, 58vw" /></div><div className="palmas-sky-plan-copy"><p className="palmas-lake-kicker">Planta Lake Sky</p><h2>Uma cobertura duplex com desenho de mansão suspensa.</h2><p>Distribuição em dois pavimentos, piscina interna, cinema, dependência, lavanderia e living superior com 172,97 m².</p><div className="palmas-sky-plan-tags"><span>662,58 m² privativos</span><span>4 suítes</span><span>6 vagas privativas</span></div></div></div></section>
      <section className="palmas-sky-leisure"><div className="palmas-sky-container palmas-sky-leisure-grid"><div><p className="palmas-lake-kicker">Lazer da torre</p><h2>Serviços e espaços pensados para poucos.</h2></div><div className="palmas-sky-leisure-list">{skyLeisure.map((feature, index) => <div key={feature}><span>0{index + 1}</span><strong>{feature}</strong></div>)}</div></div></section>
      <section className="palmas-sky-units"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Espelho de unidades</p><h2>Escolha o seu andar.</h2><p>Consulte a disponibilidade, o status e as condições atualizadas de cada unidade.</p></div><div className="palmas-sky-table-wrap"><table><thead><tr><th>Pav.</th><th>Unidade</th><th>Área</th><th>Status</th></tr></thead><tbody>{skyUnits.map(([floor, unit, area]) => <tr key={unit}><td>{floor}</td><td>{unit}</td><td>{area}</td><td><span className="palmas-sky-status palmas-sky-status--consult">Consulte</span></td></tr>)}</tbody></table></div></div></section>
    </>}
    {isGarden && <>
      <section className="palmas-sky-highlights" aria-label="Características do Lake Garden"><div className="palmas-sky-container palmas-sky-highlights-grid">{gardenHighlights.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="palmas-sky-story"><div className="palmas-sky-container palmas-sky-story-grid"><div><p className="palmas-lake-kicker">Lake Garden</p><h2>Espaço para viver com mais presença.</h2></div><div><p>O Lake Garden foi desenhado para famílias que valorizam amplitude, privacidade e a sofisticação de estar conectado à paisagem do lago.</p><p>Com apenas dois apartamentos por andar e 222,70 m² de área privativa, a torre cria uma experiência residencial mais exclusiva — com ambientes que acolhem a rotina e momentos que pedem celebração.</p></div></div></section>
      <section className="palmas-sky-gallery"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Arquitetura e interiores</p><h2>Uma torre que se abre para o lago.</h2><p>A fachada e os ambientes sugeridos traduzem o encontro entre linhas contemporâneas, luz natural e paisagismo exuberante.</p></div><div className="palmas-sky-gallery-grid palmas-garden-gallery-grid">{gardenGallery.map(([src, alt]) => <figure key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>{alt}</figcaption></figure>)}</div></div></section>
      <section className="palmas-sky-plan palmas-garden-plans" id="plantas" aria-labelledby="palmas-garden-plans-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Plantas Lake Garden</p><h2 id="palmas-garden-plans-title">Duas formas de imaginar o mesmo espaço.</h2><p>Conheça as duas opções de layout do apartamento Garden. As imagens preservam o material original, incluindo as informações já aplicadas na planta.</p></div><div className="palmas-garden-plans-grid">{gardenPlans.map(([src, alt, detail]) => <figure className="palmas-garden-plan-card" key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={alt} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized /></div><figcaption><strong>{alt}</strong><span>{detail}</span></figcaption></figure>)}</div></div></section>
      <section className="palmas-sky-leisure"><div className="palmas-sky-container palmas-sky-leisure-grid"><div><p className="palmas-lake-kicker">Lazer da torre</p><h2>Conforto, bem-estar e acesso ao melhor do Palmas Lake.</h2></div><div className="palmas-sky-leisure-list">{gardenLeisure.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><strong>{feature}</strong></div>)}</div></div></section>
      <section className="palmas-sky-units" id="unidades" aria-labelledby="palmas-garden-units-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Espelho de unidades</p><h2 id="palmas-garden-units-title">Escolha o seu andar.</h2><p>O Lake Garden tem dois apartamentos por andar, com 222,70 m² privativos. Consulte a disponibilidade e as condições atualizadas.</p></div><div className="palmas-sky-table-wrap"><table><thead><tr><th>Pav.</th><th>Unidades</th><th>Área</th><th>Status</th></tr></thead><tbody>{gardenUnits.map(([floor, unit, area]) => <tr key={floor}><td>{floor}</td><td>{unit}</td><td>{area}</td><td><span className="palmas-sky-status palmas-sky-status--consult">Consulte</span></td></tr>)}</tbody></table></div></div></section>
    </>}
    {isPark && <>
      <section className="palmas-sky-highlights" aria-label="Características do Lake Park"><div className="palmas-sky-container palmas-sky-highlights-grid">{parkHighlights.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="palmas-sky-story"><div className="palmas-sky-container palmas-sky-story-grid"><div><p className="palmas-lake-kicker">Lake Park</p><h2>Amplitude para viver bem todos os dias.</h2></div><div><p>O Lake Park combina a escala de uma torre residencial completa com plantas pensadas para a rotina real: ambientes integrados, três suítes e espaço para receber.</p><p>Com três apartamentos por andar, a torre oferece um ponto de entrada especial no Palmas Lake, mantendo a conexão com o Beach Club, a Marina e o paisagismo do complexo.</p></div></div></section>
      <section className="palmas-sky-gallery"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Arquitetura e interiores</p><h2>Uma torre desenhada para acolher.</h2><p>A fachada contemporânea e os interiores sugeridos traduzem a atmosfera residencial do Lake Park, com materiais naturais, luz e integração.</p></div><div className="palmas-sky-gallery-grid palmas-park-gallery-grid">{parkGallery.map(([src, alt]) => <figure key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>{alt}</figcaption></figure>)}</div></div></section>
      <section className="palmas-sky-plan palmas-park-plan" id="plantas" aria-labelledby="palmas-park-plan-title"><div className="palmas-sky-container palmas-sky-plan-grid"><div className="palmas-sky-plan-image palmas-park-plan-image"><Image src="/brand/palmas-lake/park-plan.webp" alt="Planta do apartamento Lake Park tipo 01" fill sizes="(max-width: 900px) 100vw, 58vw" unoptimized /></div><div className="palmas-sky-plan-copy"><p className="palmas-lake-kicker">Planta Lake Park</p><h2 id="palmas-park-plan-title">Uma planta com espaço para a vida acontecer.</h2><p>O material original apresenta o apartamento Park tipo 01 e reúne as informações essenciais da torre: três suítes, living integrado, lavabo, lavanderia e duas vagas de garagem por unidade.</p><div className="palmas-sky-plan-tags"><span>189,25 a 191,51 m² privativos</span><span>3 suítes</span><span>2 vagas por unidade</span></div></div></div></section>
      <section className="palmas-sky-leisure"><div className="palmas-sky-container palmas-sky-leisure-grid"><div><p className="palmas-lake-kicker">Lazer da torre</p><h2>Conforto para aproveitar o Palmas Lake por inteiro.</h2></div><div className="palmas-sky-leisure-list">{parkLeisure.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><strong>{feature}</strong></div>)}</div></div></section>
      <section className="palmas-sky-units" id="unidades" aria-labelledby="palmas-park-units-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Espelho de unidades</p><h2 id="palmas-park-units-title">Escolha o seu andar.</h2><p>O Lake Park tem três apartamentos por andar, com plantas entre 189,25 m² e 191,51 m² privativos. Os valores e status abaixo reproduzem a tabela zero enviada, de 02/06/2026; confirme as condições no atendimento.</p></div><div className="palmas-sky-table-wrap"><table><thead><tr><th>Pav.</th><th>Unidade</th><th>Área</th><th>Valor</th><th>Status</th></tr></thead><tbody>{parkUnits.map(([floor, unit, area, value, status]) => <tr key={unit}><td>{floor}</td><td>{unit}</td><td>{area}</td><td>{value}</td><td><span className={`palmas-sky-status ${parkStatusClass(status)}`}>{status}</span></td></tr>)}</tbody></table></div></div></section>
    </>}
    {isMall && <>
      <section className="palmas-sky-highlights" aria-label="Características do Lake Mall"><div className="palmas-sky-container palmas-sky-highlights-grid">{mallHighlights.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="palmas-sky-story"><div className="palmas-sky-container palmas-sky-story-grid"><div><p className="palmas-lake-kicker">Lake Mall</p><h2>Um novo endereço para encontrar, celebrar e permanecer.</h2></div><div><p>O Lake Mall é o coração de convívio do Palmas Lake: uma torre multifuncional que reúne gastronomia, serviços e experiências em um endereço conectado à paisagem da Marina.</p><p>São 32 lojas exclusivas, com áreas de 42,49 m² a 631,77 m², desenhadas para receber marcas, encontros e momentos que fazem parte da vida do complexo.</p></div></div></section>
      <section className="palmas-sky-gallery palmas-mall-gallery"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Arquitetura e experiências</p><h2>Uma atmosfera que começa na fachada e continua por dentro.</h2><p>Da chegada pela fachada oficial aos interiores e ao salão de eventos, cada ambiente foi pensado para transformar circulação em experiência.</p></div><div className="palmas-sky-gallery-grid palmas-mall-gallery-grid">{mallGallery.map(([src, alt]) => <figure key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>{alt}</figcaption></figure>)}</div></div></section>
      <section className="palmas-sky-leisure palmas-mall-experiences"><div className="palmas-sky-container palmas-sky-leisure-grid"><div><p className="palmas-lake-kicker">Lazer e conexão</p><h2>O ponto de encontro de todo o complexo.</h2></div><div className="palmas-sky-leisure-list">{mallExperiences.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><strong>{feature}</strong></div>)}</div></div></section>
      <section className="palmas-sky-plan palmas-mall-cta" id="lojas" aria-labelledby="palmas-mall-cta-title"><div className="palmas-sky-container palmas-sky-plan-grid"><div className="palmas-sky-plan-image"><Image src="/brand/palmas-lake/lake-mall-facade.jpg" alt="Fachada oficial do Lake Mall ao lado da Marina" fill sizes="(max-width: 900px) 100vw, 58vw" /></div><div className="palmas-sky-plan-copy"><p className="palmas-lake-kicker">Lake Mall · entrega 2029</p><h2 id="palmas-mall-cta-title">Seu negócio no coração do Palmas Lake.</h2><p>Conheça as lojas, as áreas disponíveis e as possibilidades de operação para gastronomia e serviços.</p><a className="palmas-lake-button palmas-lake-button--gold" href={whatsappHref} target="_blank" rel="noreferrer">Falar sobre uma loja <ArrowUpRight size={17} /></a></div></div></section>
    </>}
    {isOffice && <>
      <section className="palmas-sky-highlights palmas-office-highlights" aria-label="Características do Lake Office"><div className="palmas-sky-container palmas-sky-highlights-grid">{officeHighlights.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="palmas-sky-story palmas-office-story"><div className="palmas-sky-container palmas-sky-story-grid"><div><p className="palmas-lake-kicker">Lake Office · Business Center</p><h2>Trabalho, encontro e endereço em um só lugar.</h2></div><div><p>O Lake Office é a torre multifuncional do Palmas Lake voltada para negócios: 222 unidades, de salas compactas a amplas lajes corporativas, para quem quer trabalhar com a paisagem do lago como parte do endereço.</p><p>Com entrega prevista para 2029, a torre conecta produtividade e conveniência ao acesso direto ao Mall, à gastronomia, ao lazer e à estrutura compartilhada do complexo.</p></div></div></section>
      <section className="palmas-sky-gallery palmas-office-gallery" aria-labelledby="palmas-office-gallery-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Arquitetura e interiores sugeridos</p><h2 id="palmas-office-gallery-title">Uma nova forma de trabalhar à beira do lago.</h2><p>Ambientes corporativos com luz natural, varandas e uma atmosfera pensada para receber clientes, equipes e parceiros.</p></div><div className="palmas-sky-gallery-grid">{officeGallery.map(([src, alt]) => <figure key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>{alt}</figcaption></figure>)}</div></div></section>
      <section className="palmas-office-access"><div className="palmas-sky-container palmas-office-access-grid"><div className="palmas-office-access-image"><Image src="/brand/palmas-lake/office-hero.jpg" alt="Vista aérea do heliponto no terraço do Lake Office" fill sizes="(max-width: 800px) 100vw, 48vw" /></div><div className="palmas-office-access-copy"><p className="palmas-lake-kicker">Conexão com o complexo</p><h2>O heliponto no terraço aproxima o Lake Office de todo o Palmas Lake.</h2><p>O heliponto integra a estrutura de acesso do complexo e reforça a vocação do Lake Office para negócios, encontros e hospitalidade. No mesmo endereço, a torre se conecta ao Mall, ao rooftop social, à sala de conferências e às experiências de lazer e gastronomia.</p><div className="palmas-office-access-list"><span>Heliponto no terraço</span><span>Acesso direto ao Mall</span><span>Rooftop social e sala de conferências</span></div></div></div></section>
      <section className="palmas-sky-plan palmas-office-plans" id="plantas" aria-labelledby="palmas-office-plans-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Plantas Lake Office</p><h2 id="palmas-office-plans-title">Duas plantas para diferentes formas de operar.</h2><p>Veja as opções de layout disponíveis e consulte a melhor configuração para o seu negócio.</p></div><div className="palmas-garden-plans-grid">{officePlans.map(([src, title, detail]) => <figure className="palmas-garden-plan-card" key={src}><div><Image src={`/brand/palmas-lake/${src}`} alt={title} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized /></div><figcaption><strong>{title}</strong><span>{detail}</span></figcaption></figure>)}</div></div></section>
      <section className="palmas-office-sizes" aria-labelledby="palmas-office-sizes-title"><div className="palmas-sky-container"><div className="palmas-sky-section-heading"><p className="palmas-lake-kicker">Metragens do espelho</p><h2 id="palmas-office-sizes-title">Do compacto à laje corporativa.</h2><p>As faixas abaixo foram organizadas a partir do espelho de unidades enviado. Valores, status e disponibilidade devem ser confirmados no atendimento.</p></div><div className="palmas-office-size-grid">{officeSizeBands.map(([title, sizes, detail], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><strong>{sizes}</strong><p>{detail}</p></article>)}</div></div></section>
      <section className="palmas-sky-leisure palmas-office-leisure"><div className="palmas-sky-container palmas-sky-leisure-grid"><div><p className="palmas-lake-kicker">Lazer e serviços da torre</p><h2>Uma estrutura que apoia o seu negócio.</h2></div><div className="palmas-sky-leisure-list"><div><span>01</span><strong>Sala de conferências para reuniões e apresentações</strong></div><div><span>02</span><strong>Rooftop social para encontros e eventos</strong></div><div><span>03</span><strong>Heliponto no terraço utilizado pelo complexo</strong></div><div><span>04</span><strong>Acesso facilitado ao lazer e à gastronomia do Mall</strong></div><div><span>05</span><strong>Estacionamento rotativo para a rotina profissional</strong></div></div></div></section>
      <section className="palmas-sky-plan palmas-office-cta" id="condicoes" aria-labelledby="palmas-office-cta-title"><div className="palmas-sky-container palmas-office-cta-inner"><div><p className="palmas-lake-kicker">Lake Office · entrega 2029</p><h2 id="palmas-office-cta-title">Seu próximo endereço profissional pode estar no lago.</h2><p>Receba as plantas, o espelho de unidades e as condições atualizadas do Business Center.</p></div><a className="palmas-lake-button palmas-lake-button--gold" href={whatsappHref} target="_blank" rel="noreferrer">Receber plantas e condições <ArrowUpRight size={17} /></a></div></section>
    </>}
    <div className="palmas-detail-footer"><Link href="/palmas-lake"><ArrowLeft size={15} /> Voltar ao complexo</Link></div>
    <a className="palmas-lake-whatsapp-float" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`Falar com Pedro Soares pelo WhatsApp sobre o ${item.name}`}>
      <span className="palmas-lake-whatsapp-avatar"><Image src="/brand/pedro-whatsapp-avatar.png" alt="" fill sizes="56px" /></span>
      <span className="palmas-lake-whatsapp-copy"><strong>Fale comigo</strong><small>WhatsApp · (63) 98484-5101</small></span>
      <MessageCircle className="palmas-lake-whatsapp-icon" size={22} />
    </a>
  </div>;
}
