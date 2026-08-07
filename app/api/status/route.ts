import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Upstash Connection
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

    const cleanKey = apiKey.trim();

    // 1. Asli Upstash Database se Verify karo
    const keyData = await redis.get(`api_key:${cleanKey}`);
    if (!keyData) {
      return NextResponse.json({ valid: false }, { status: 401 }); // Key expired or fake
    }

    // 2. 100% REAL DATA FETCH 
    // Jab tu apna Cloudflare proxy banayega, tab wo in keys me data update karega.
    // Abhi naya user hai, toh database me data nahi hoga, isliye perfectly '0' dikhega.
    const usageData = await redis.get(`usage_tokens:${cleanKey}`);
    const hitsData = await redis.get(`cache_hits:${cleanKey}`);
    const reqsData = await redis.get(`total_requests:${cleanKey}`);

    const realTokens = usageData ? Number(usageData) : 0;
    const realHits = hitsData ? Number(hitsData) : 0;
    const realReqs = reqsData ? Number(reqsData) : 0;

    let calculatedHitRate = 0;
    if (realReqs > 0) {
      calculatedHitRate = Math.round((realHits / realReqs) * 100);
    }

    return NextResponse.json({ 
      valid: true,
      tokens: realTokens,
      requests: realReqs,
      hitRate: calculatedHitRate
    });

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ valid: false, error: "Internal Server Error" }, { status: 500 });
  }
}
