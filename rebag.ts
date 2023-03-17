import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default async function searchRebag(string) {
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
  const items = $('.plp__product.plp-product').map(function() {
    return {
      brand: $(`.products-carousel__card-designer`, this).text(),
      name: $('.products-carousel__card-title', this).text(),
      quality: $('.products-carousel__card-condition', this).text(),
      price: +$('.products-carousel__card-price', this).text()?.replace(/[^0-9.-]+/g,""),
      link:$('a.plp__card', this).attr('href'),
      id: "rebag" + $('a.plp__card', this).attr('href')?.split('-')?.pop()
    }
  }).get();
  await browser.close();
  return items;
}
