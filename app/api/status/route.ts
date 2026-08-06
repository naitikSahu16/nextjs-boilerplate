import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 400 });
    }

    // Connect securely from the server, hiding our tokens from the browser
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
       return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    // Fetch data securely from Upstash Edge
    const res = await fetch(`${upstashUrl}/get/key:${apiKey}`, {
      headers: { Authorization: `Bearer ${upstashToken}` }
    });
    
    const dbResponse = await res.json();

    // Check if the key exists in the database
    if (dbResponse.result) {
      const userData = JSON.parse(dbResponse.result);
      return NextResponse.json({ 
        valid: true, 
        tokens: userData.saved_tokens || 0 
      });
    } else {
      return NextResponse.json({ valid: false }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
