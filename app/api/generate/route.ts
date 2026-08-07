import { auth } from '@clerk/nextjs/server';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Initialize Upstash Redis Connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    // 1. Authenticate user via Clerk (Awaiting the promise fixes the Vercel error)
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please Log In." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const isTrialRequest = body.plan === "pro_trial";

    // 2. Pro Trial Logic (1-Time Lock)
    if (isTrialRequest) {
      // Check if this specific user has already claimed a trial
      const hasUsedTrial = await redis.get(`trial_used:${userId}`);
      
      if (hasUsedTrial) {
        return NextResponse.json(
          { error: "Trial limit reached. You can only use the trial once per account." },
          { status: 403 }
        );
      }

      // Generate a unique trial key
      const trialKey = "tt_trial_" + crypto.randomBytes(16).toString("hex");

      // Store trial key with a 3-day expiration (259200 seconds)
      await redis.set(`api_key:${trialKey}`, { userId, tier: "pro" }, { ex: 259200 });
      
      // Permanently flag this user as having used their trial
      await redis.set(`trial_used:${userId}`, true);
      
      // Store current key for dashboard display (expires in 3 days)
      await redis.set(`user_key:${userId}`, trialKey, { ex: 259200 });

      return NextResponse.json({ apiKey: trialKey, message: "Trial Activated" });
    }

    // 3. Normal Free Tier Logic
    const existingKey = await redis.get(`user_key:${userId}`);
    if (existingKey) {
      return NextResponse.json({ apiKey: existingKey });
    }

    const freeKey = "tt_free_" + crypto.randomBytes(16).toString("hex");
    
    // Store free key permanently (Limits will be handled by Cloudflare proxy)
    await redis.set(`api_key:${freeKey}`, { userId, tier: "free" });
    await redis.set(`user_key:${userId}`, freeKey);

    return NextResponse.json({ apiKey: freeKey });

  } catch (error) {
    console.error("API Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
