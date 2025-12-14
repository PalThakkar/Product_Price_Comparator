const puppeteer = require('puppeteer');

async function scrapeProduct(url){
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // adjust selectors to actual site
  const data = await page.evaluate(()=> {
    const title = document.querySelector('#productTitle')?.innerText?.trim();
    const price = document.querySelector('#priceblock_ourprice, #priceblock_dealprice')?.innerText?.replace(/[^\d\.]/g,'');
    return { title, price: price ? parseFloat(price) : null };
  });

  await browser.close();
  return data;
}

// if run directly
if(require.main === module){
  (async ()=>{
    const url = process.argv[2];
    if(!url) return console.error('usage: node scrapeAmazon.js <url>');
    console.log(await scrapeProduct(url));
  })();
}

module.exports = { scrapeProduct };