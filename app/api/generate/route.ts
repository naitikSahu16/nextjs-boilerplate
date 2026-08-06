import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
       return NextResponse.json({ error: "Database credentials missing" }, { status: 500 });
    }

    // Step 1: Check if the user already has an API key in the database
    const checkRes = await fetch(`${upstashUrl}/get/user:${userId}:apikey`, {
      headers: { Authorization: `Bearer ${upstashToken}` }
    });
    const checkData = await checkRes.json();

    if (checkData.result) {
      // If a key already exists, return the existing key. Do not generate a new one.
      return NextResponse.json({ success: true, apiKey: checkData.result });
    }

    // Step 2: If no key exists, generate a new secure, random API Key
    const apiKey = "tt_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const userDataPayload = JSON.stringify({ userId: userId, saved_tokens: 0 });

    // Save the new API Key with initial token data
    await fetch(upstashUrl, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["SET", `key:${apiKey}`, userDataPayload])
    });

    // Link the new API Key to the user's ID for future retrievals
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
