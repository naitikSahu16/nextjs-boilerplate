import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Upstash Connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json().catch(() => ({}));

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: "No API key provided" }, { status: 400 });
    }

    // 1. Upstash database me check karo ki kya ye key asli hai?
    const keyData = await redis.get(`api_key:${apiKey.trim()}`);

    if (!keyData) {
      // Agar database me key nahi mili (ya expire ho gayi), toh invalid bol do
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // 2. Agar key asli hai, toh dashboard par dikhane ke liye Dummy Metrics bhej do
    // (Asli startup me ye data Cloudflare analytics se aayega, abhi UI showcase ke liye hum random badhiya numbers bhej rahe hain)
    return NextResponse.json({ 
      valid: true,
      tokens: Math.floor(Math.random() * 5000000) + 1500000 // 1.5M se 6.5M ke beech ke tokens
    });

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ valid: false, error: "Internal Server Error" }, { status: 500 });
  }
}
