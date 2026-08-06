import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    // Authenticate user via Clerk (using await for the latest Clerk version)
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a secure, random API Key
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const apiKey = "tt_live_" + randomString;

    // Retrieve Upstash Redis credentials from Environment Variables
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
       return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    // Save the API key to Redis and initialize saved_tokens to 0
    await fetch(`${upstashUrl}/set/key:${apiKey}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${upstashToken}` },
      body: JSON.stringify({ userId: userId, saved_tokens: 0 })
    });

    // Link the API key to the specific user ID in Redis
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
