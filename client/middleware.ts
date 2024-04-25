import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";

export async function middleware(request: NextRequest) {
  const orgin = request.headers.get("origin");
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "*");
  response.headers.set("Access-Control-Max-age", "86400");

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });

  console.log("authenticated", authenticated);

  if (authenticated) {
    return response;
  }

  return NextResponse.redirect(new URL("/signup", request.url));
}

export const config = {
  matcher: ["/"],
};
