import { getSession } from "@/lib/auth-client";
import type { SessionUser } from "@/types/auth";

type BetterAuthSession = {
  user: SessionUser;
} | null;

export async function getSafeSession(req: Request): Promise<BetterAuthSession> {
  const result = await getSession({
    fetchOptions: {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    },
  });

  console.log("SESSION RESULT 👉", result);

  // ❗ important: check result.data
  if (!result || "error" in result || !result.data) {
    return null;
  }

  return {
    user: result.data.user as SessionUser,
  };
}
