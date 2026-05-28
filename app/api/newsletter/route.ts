import { NextResponse } from "next/server";
import { uappiPostNewsletter } from "@/lib/uappi";

const EMAIL_REGEX = /@.*\.[A-Za-z]/;
const MAX_EMAIL_LENGTH = 254;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ sucesso: false }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email: unknown }).email
      : null;

  if (
    typeof email !== "string" ||
    email.length === 0 ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_REGEX.test(email)
  ) {
    return NextResponse.json({ sucesso: false }, { status: 400 });
  }

  try {
    const result = await uappiPostNewsletter({ email });
    return NextResponse.json({ sucesso: result.sucesso });
  } catch (error) {
    console.error(
      "[api/newsletter] upstream Uappi falhou",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ sucesso: false }, { status: 502 });
  }
}
