const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

module.exports = async function searchTheRealReal(string) {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(`https://www.therealreal.com/products?keywords=${encodeURIComponent(string)}`);
  // do something with the search results page here
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);
  const items = $('.product-card-aligner').map(function() {
    return {
      brand: $('.product-card__brand', this).text(),
      name: $('.product-card__description', this).text(),
      price: $('.product-card__price', this).text(),
      link:$('a.product-card', this).attr('href')
    }
  }).get();
  await browser.close();
  return items;
}
