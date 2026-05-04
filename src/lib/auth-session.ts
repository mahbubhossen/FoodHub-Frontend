import type { SessionUser } from "@/types/auth";

type BetterAuthSession = {
  user: SessionUser;
} | null;

export async function getSafeSession(req: Request): Promise<BetterAuthSession> {
  try {
    // 🔥 IMPORTANT: call via NEXT.js proxy (NOT backend directly)
    const res = await fetch("http://localhost:3000/api/auth/get-session", {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const data = await res.json();

    console.log("SESSION RESULT 👉", data);

    // ❌ no session case
    if (!data || !data.user) {
      return null;
    }

    // ✅ return normalized session
    return {
      user: data.user as SessionUser,
    };
  } catch (error) {
    console.log("SESSION ERROR 👉", error);
    return null;
  }
}
