import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Bulletproof Next.js redirect preservation: use request.nextUrl to keep https/http protocol, host and port intact
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = next;
      redirectUrl.searchParams.delete("code");
      redirectUrl.searchParams.delete("next");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If OAuth callback fails, redirect back to login page with an error
  const errorUrl = request.nextUrl.clone();
  errorUrl.pathname = "/auth/login";
  errorUrl.searchParams.set("error", "oauth_callback_error");
  return NextResponse.redirect(errorUrl);
}
