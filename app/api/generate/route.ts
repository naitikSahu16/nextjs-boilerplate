import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a secure, random API Key
    const apiKey = "tt_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Retrieve Upstash Redis credentials from Environment Variables
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
       return NextResponse.json({ error: "Database credentials missing" }, { status: 500 });
    }

    // Prepare the payload as a strict JSON string
    const userDataPayload = JSON.stringify({ userId: userId, saved_tokens: 0 });

    // 1. Save API Key -> User Data (Using standard Upstash Array Format)
    await fetch(upstashUrl, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["SET", `key:${apiKey}`, userDataPayload])
    });

    // 2. Save User ID -> API Key (For future reference)
    await fetch(upstashUrl, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["SET", `user:${userId}:apikey`, apiKey])
    });

    return NextResponse.json({ success: true, apiKey });

  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}
