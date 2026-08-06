import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const apiKey = "tt_live_" + randomString;

    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
       return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    await fetch(`${upstashUrl}/set/key:${apiKey}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${upstashToken}` },
      body: JSON.stringify({ userId: userId, saved_tokens: 0 })
    });

    await fetch(`${upstashUrl}/set/user:${userId}:apikey`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${upstashToken}` },
      body: apiKey
    });

    return NextResponse.json({ success: true, apiKey });

  } catch (error) {
    return NextResponse.json({ error: "Failed to generate key" }, { status: 500 });
  }
}
