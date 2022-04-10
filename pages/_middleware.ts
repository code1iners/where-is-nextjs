import { useEffect } from "react";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (request.ua?.isBot) {
    return new NextResponse("Oh You are not a human.", {
      status: 403,
    });
  }
}
