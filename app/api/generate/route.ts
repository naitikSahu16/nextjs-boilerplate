import { auth } from '@clerk/nextjs/server';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Upstash Database Connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    // 1. Clerk se user ID nikalna taaki fake log key na le sakein
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please Log In." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const isTrialRequest = body.plan === "pro_trial";

    // 2. TRIAL REQUEST LOGIC (Locking mechanism)
    if (isTrialRequest) {
      // Check karo Upstash me ki isne pehle trial liya hai kya?
      const hasUsedTrial = await redis.get(`trial_used:${userId}`);
      
      if (hasUsedTrial) {
        // Agar record mila, toh bhaga do
        return NextResponse.json(
          { error: "Trial limit reached. You can only use the trial once per account." },
          { status: 403 }
        );
      }

      // Agar first time hai, toh Trial Key banao
      const trialKey = "tt_trial_" + crypto.randomBytes(16).toString("hex");

      // Upstash me 3 din (259200 seconds) ke liye key save karo. 3 din baad auto-delete!
      await redis.set(`api_key:${trialKey}`, { userId, tier: "pro" }, { ex: 259200 });
      
      // Permanently mark kar do ki is bande ne trial le liya hai (Ye delete nahi hoga)
      await redis.set(`trial_used:${userId}`, true);
      
      // Dashboard par dikhane ke liye key save karo (3 din baad hat jayegi)
      await redis.set(`user_key:${userId}`, trialKey, { ex: 259200 });

      return NextResponse.json({ apiKey: trialKey, message: "Trial Activated" });
    }

    // 3. NORMAL FREE TIER LOGIC (Hobby Plan)
    const existingKey = await redis.get(`user_key:${userId}`);
    if (existingKey) {
      return NextResponse.json({ apiKey: existingKey }); // Purani key wapas de do
    }

    const freeKey = "tt_free_" + crypto.randomBytes(16).toString("hex");
    
    // Free key hamesha rahegi, par iski 10,000 ki limit Cloudflare check karega
    await redis.set(`api_key:${freeKey}`, { userId, tier: "free" });
    await redis.set(`user_key:${userId}`, freeKey);

    return NextResponse.json({ apiKey: freeKey });

  } catch (error) {
    console.error("API Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
