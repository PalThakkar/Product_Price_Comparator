import redis from "../utils/redisClient.js";
import amazon from "../scrapers/amazon.js";
import flipkart from "../scrapers/flipkart.js";
import croma from "../scrapers/croma.js";

router.get("/search", async (req, res) => {
  const query = req.query.q?.toLowerCase().trim();
  const cacheKey = `search:${query}`;

  // 1️⃣ CHECK CACHE
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("⚡ Redis cache hit");
    return res.json(JSON.parse(cached));
  }

  console.log("❌ Cache miss — scraping");

  // 2️⃣ SCRAPE IN PARALLEL
  const results = await Promise.allSettled([
    amazon(query),
    flipkart(query),
    croma(query)
  ]);

  const products = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);

  // 3️⃣ SORT LOWEST PRICE FIRST
  products.sort((a, b) => a.price - b.price);

  // 4️⃣ SAVE TO REDIS
  await redis.set(
    cacheKey,
    JSON.stringify(products),
    { EX: 3600 } // 1 hour
  );

  res.json(products);
});
