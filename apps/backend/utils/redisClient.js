import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = createClient({
  url: redisUrl,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

// Connect with retry logic
let retries = 0;
const maxRetries = 5;

const connectRedis = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (err) {
    if (retries < maxRetries) {
      retries++;
      console.warn(
        `Redis connection attempt ${retries}/${maxRetries} failed. Retrying...`
      );
      setTimeout(connectRedis, 2000);
    } else {
      console.error("Failed to connect to Redis after retries:", err);
    }
  }
};

connectRedis();

export default redis;
