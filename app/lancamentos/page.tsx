import { redirect } from "next/navigation";

function appendQuery(path: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export default async function LancamentosRedirectPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === "string" && value) {
      query.set(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((item) => query.append(key, item));
    }
  });

  redirect(appendQuery("/imoveis/na-planta", query));
}
