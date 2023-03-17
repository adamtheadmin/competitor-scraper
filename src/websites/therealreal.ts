import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default async function searchTheRealReal(string: string) {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=1150,750`]
    });
    const page = await browser.newPage();
    const url = `https://www.therealreal.com/products?keywords=${string.replace(/ /g, "+")}`;
    console.log(url);
    await page.goto(url);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const items = $('.product-card').map(function() {
        return {
            brand: $('.product-card__brand', this).text(),
            name: $('.product-card__description', this).text(),
            price: +$('.product-card__msrp', this).text()?.match(/\$([\d,]+\.\d{2})/)?.[1]?.replace(/,/g, ''),
            link: 'https://www.therealreal.com' + $(this).attr('href')
        }
    }).get();
    await browser.close();
    return items;
}
