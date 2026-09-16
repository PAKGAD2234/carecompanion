import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const providerError = requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");

  if (!code) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", providerError ? "provider" : "oauth");
    if (providerError) loginUrl.searchParams.set("message", providerError.slice(0, 160));
    return NextResponse.redirect(loginUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.headers.get("cookie")?.split("; ").map((cookie) => {
          const separator = cookie.indexOf("=");
          return { name: cookie.slice(0, separator), value: cookie.slice(separator + 1) };
        }) ?? [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.headers.set("cookie", `${name}=${value}`));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);// Exchange the code for a session
  if (exchangeError) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "exchange");
    loginUrl.searchParams.set("message", exchangeError.message.slice(0, 160));
    return NextResponse.redirect(loginUrl);// Redirect to login page if there was an error exchanging the code
  }

  const { data: userData } = await supabase.auth.getUser();// Get the authenticated user data
  if (!userData.user) {
    return NextResponse.redirect(new URL("/login?error=session", request.url));// Redirect to login page if there was an error getting the user data
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  const destination = profile?.role && ["customer", "companion", "admin"].includes(profile.role)
    ? `/${profile.role}`
    : "/select-role";

  const redirectResponse = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}