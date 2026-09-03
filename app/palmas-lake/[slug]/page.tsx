import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";

const items = {
  "lake-sky": { name: "Lake Sky", group: "Residencial", year: "2032", image: "sky-hero", title: "Máxima exclusividade", description: "Coberturas duplex e mansões suspensas com vista permanente para o lago — o produto de maior padrão do complexo.", specs: ["331,29 a 662,58 m²", "4 suítes", "4 a 6 vagas", "Piscina interna e cinema"] },
  "lake-garden": { name: "Lake Garden", group: "Residencial", year: "2032", image: "garden-tower", title: "Alto luxo residencial.", description: "Dois apartamentos por andar, amplos e desenhados para famílias que buscam espaço e sofisticação à beira do lago.", specs: ["222,70 m²", "2 apartamentos por andar", "3 ou 4 suítes", "3 vagas de garagem"] },
  "lake-park": { name: "Lake Park", group: "Residencial", year: "2032", image: "park", title: "Conforto residencial amplo.", description: "Três apartamentos por andar, plantas flexíveis e o melhor ponto de entrada entre as torres residenciais do complexo.", specs: ["189,25 a 191,51 m²", "3 suítes", "2 vagas", "Living integrado"] },
  "lake-loft": { name: "Lake Loft", group: "Multifuncional", year: "2029", image: "loft", title: "Morar, hospedar, investir.", description: "160 unidades compactas e inteligentes, preparadas tanto para moradia permanente quanto para hospedagem temporária.", specs: ["44,51 a 57,98 m²", "1 ou 2 dormitórios", "1 vaga", "Rooftop social"] },
  "lake-office": { name: "Lake Office", group: "Business Center", year: "2029", image: "office", title: "Seu próximo endereço profissional.", description: "Salas compactas e amplas lajes corporativas onde é possível trabalhar e viver no mesmo endereço, com acesso direto ao Mall.", specs: ["52,04 a 509,85 m²", "222 salas", "Estacionamento rotativo", "Rooftop e heliponto"] },
  "lake-mall": { name: "Lake Mall", group: "Shopping conceito", year: "2029", image: "mall", title: "O coração de convívio.", description: "32 lojas exclusivas de gastronomia e serviços, com rooftop social e integração com a Marina e as torres do complexo.", specs: ["42,49 a 631,77 m²", "32 lojas", "Gastronomia e serviços", "Rooftop social e heliponto"] }
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
  const whatsappHref = `https://wa.me/5563984845101?text=${encodeURIComponent(`Olá Pedro, quero conhecer o ${item.name}.`)}`;
  return <div className="palmas-detail-page">
    <div className={`palmas-detail-hero${isGarden ? " palmas-detail-hero--garden" : ""}`}><Image src={`/brand/palmas-lake/${item.image}.${isGarden ? "webp" : "jpg"}`} alt={`Imagem do ${item.name}`} fill priority sizes="100vw" /><div className="palmas-detail-overlay" /><div className="palmas-detail-top"><Link href="/palmas-lake" className="palmas-detail-back"><ArrowLeft size={16} /> Palmas Lake</Link><span>{item.group} · entrega {item.year}</span></div><div className="palmas-detail-hero-copy"><p>Uma experiência Palmas Lake</p><h1>{item.name}</h1><h2>{item.title}</h2></div></div>
    <main className="palmas-detail-main"><div className="palmas-detail-copy"><p className="palmas-lake-kicker">Torre residencial · entrega {item.year}</p><h2>{item.title}</h2><p>{item.description}</p><a className="palmas-lake-button palmas-lake-button--gold" href={whatsappHref} target="_blank" rel="noreferrer">Conhecer esta experiência <ArrowUpRight size={17} /></a></div><div className="palmas-detail-specs">{item.specs.map((spec, index) => <div key={spec}><span>0{index + 1}</span><strong>{spec}</strong></div>)}</div></main>
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
    <div className="palmas-detail-footer"><Link href="/palmas-lake"><ArrowLeft size={15} /> Voltar ao complexo</Link></div>
    <a className="palmas-lake-whatsapp-float" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`Falar com Pedro Soares pelo WhatsApp sobre o ${item.name}`}>
      <span className="palmas-lake-whatsapp-avatar"><Image src="/brand/pedro-whatsapp-avatar.png" alt="" fill sizes="56px" /></span>
      <span className="palmas-lake-whatsapp-copy"><strong>Fale comigo</strong><small>WhatsApp · (63) 98484-5101</small></span>
      <MessageCircle className="palmas-lake-whatsapp-icon" size={22} />
    </a>
  </div>;
}
