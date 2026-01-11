console.log("🔥🔥🔥 CROMA API FILE LOADED 🔥🔥🔥");

const axios = require("axios");

async function scrapeCromaSearch(query, max = 8) {
  try {
    const url =
      "https://api.croma.com/searchservices/v1/search" +
      `?currentPage=0&query=${encodeURIComponent(query)}%3Arelevance&fields=FULL&channel=WEB&channelCode=400049&spellOpt=DEFAULT`;

    const { data } = await axios.get(url, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "origin": "https://www.croma.com",
        "referer": "https://www.croma.com/",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36",
      },
      timeout: 15000,
    });

    const products = data?.products || [];

    const results = products.map(p => ({
      site: "Croma",
      title: p.name,
      price: p.price?.value || null,
      image: p.plpImage,
      productUrl: `https://www.croma.com${p.url}`,
    }));

    console.log("🟣 [CROMA] extracted:", results.length);

    return results.slice(0, max);
  } catch (err) {
    console.error(
      "❌ [CROMA FAILED]",
      err.response?.status,
      err.message
    );
    return [];
  }
}

module.exports = { scrapeCromaSearch };
