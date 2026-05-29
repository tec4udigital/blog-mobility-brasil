import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RevalidatePayload {
  tag?: string;
  tags?: string[];
  path?: string;
  paths?: string[];
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

function extractSecret(req: NextRequest): string | null {
  const header = req.headers.get("x-revalidate-secret");
  if (header) return header;
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice("Bearer ".length).trim();
  return req.nextUrl.searchParams.get("secret");
}

async function parseBody(req: NextRequest): Promise<RevalidatePayload> {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const json = (await req.json()) as RevalidatePayload;
      return json ?? {};
    } catch {
      return {};
    }
  }
  return {};
}

function collectTags(payload: RevalidatePayload, req: NextRequest): string[] {
  const tags = new Set<string>();
  const qsTag = req.nextUrl.searchParams.get("tag");
  if (qsTag) tags.add(qsTag);
  for (const t of req.nextUrl.searchParams.getAll("tags")) tags.add(t);
  if (payload.tag) tags.add(payload.tag);
  payload.tags?.forEach((t) => tags.add(t));
  return Array.from(tags).filter(Boolean);
}

function collectPaths(payload: RevalidatePayload, req: NextRequest): string[] {
  const paths = new Set<string>();
  const qsPath = req.nextUrl.searchParams.get("path");
  if (qsPath) paths.add(qsPath);
  for (const p of req.nextUrl.searchParams.getAll("paths")) paths.add(p);
  if (payload.path) paths.add(payload.path);
  payload.paths?.forEach((p) => paths.add(p));
  return Array.from(paths).filter(Boolean);
}

async function handle(req: NextRequest) {
  const expected = process.env.WORDPRESS_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "WORDPRESS_REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }

  const provided = extractSecret(req);
  if (!provided || provided !== expected) return unauthorized();

  const payload = await parseBody(req);
  const tags = collectTags(payload, req);
  const paths = collectPaths(payload, req);

  if (tags.length === 0 && paths.length === 0) {
    return badRequest("missing tag(s) or path(s)");
  }

  tags.forEach((tag) => revalidateTag(tag, "default"));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({
    ok: true,
    revalidated: { tags, paths },
    now: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}
