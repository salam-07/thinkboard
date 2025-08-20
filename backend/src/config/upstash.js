import dotenv from "dotenv";
dotenv.config();
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// create a rate limiter that allows 100 requests per 60 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "10 s")
});

export default ratelimit;