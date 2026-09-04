import { redirect } from "next/navigation";

export default async function LegacyLancamentoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "yacht-by-fama") {
    redirect("/yacht-fama");
  }

  redirect("/lancamentos");
}
