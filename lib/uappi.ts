import "server-only";

const UAPPI_API_BASE = process.env.UAPPI_API_BASE;
const UAPPI_APP_TOKEN = process.env.UAPPI_APP_TOKEN;

if (!UAPPI_API_BASE) {
  throw new Error(
    "UAPPI_API_BASE não definida. Configure o `.env.local`.",
  );
}
if (!UAPPI_APP_TOKEN) {
  throw new Error(
    "UAPPI_APP_TOKEN não definida. Configure o `.env.local`.",
  );
}

export class UappiError extends Error {
  public readonly status: number;
  public readonly path: string;
  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = "UappiError";
    this.status = status;
    this.path = path;
  }
}

interface UappiGetOptions {
  tags?: string[];
  revalidate?: number | false;
}

export const DEFAULT_REVALIDATE_SECONDS = 60 * 60;

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function uappiGet<T>(
  path: string,
  options: UappiGetOptions = {},
): Promise<T> {
  const { tags, revalidate } = options;
  const nextOptions: { tags?: string[]; revalidate?: number | false } = {};
  if (tags && tags.length > 0) nextOptions.tags = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  else if (!nextOptions.tags) nextOptions.revalidate = DEFAULT_REVALIDATE_SECONDS;

  const url = joinUrl(UAPPI_API_BASE as string, path);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "App-Token": UAPPI_APP_TOKEN as string,
      Accept: "application/json",
    },
    next: nextOptions,
  });

  if (!response.ok) {
    throw new UappiError(
      `Uappi GET ${path} respondeu HTTP ${response.status}`,
      response.status,
      path,
    );
  }

  return (await response.json()) as T;
}

interface NewsletterPayload {
  email: string;
}

export async function uappiPostNewsletter(
  { email }: NewsletterPayload,
): Promise<{ sucesso: boolean }> {
  const url = joinUrl(UAPPI_API_BASE as string, "/v2/front/newsletter");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "App-Token": UAPPI_APP_TOKEN as string,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ nome: "", email, informacoesAdicionais: {} }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new UappiError(
      `Uappi POST /v2/front/newsletter respondeu HTTP ${response.status}`,
      response.status,
      "/v2/front/newsletter",
    );
  }

  const data = (await response.json()) as { sucesso?: boolean };
  return { sucesso: Boolean(data.sucesso) };
}
