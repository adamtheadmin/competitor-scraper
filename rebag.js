const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

module.exports = async function searchTheRealReal(string) {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(`https://shop.rebag.com/search?q=${string}`);

  // wait for the SPA to load
  await page.waitForSelector('.plp__product.plp-product');
  // do something with the search results page here
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);
  const items = $('.plp__product.plp-product').map((i, item) => {
    return {
      brand: $(`.products-carousel__card-designer`, item).text(),
      name: $('.products-carousel__card-title', item).text(),
      quality: $('.products-carousel__card-condition', item).text(),
      price: $('.products-carousel__card-price', item).text(),
      link:$('a.plp__card', item).attr('href')
    }
  }).get();
  await browser.close();
  return items;
}
