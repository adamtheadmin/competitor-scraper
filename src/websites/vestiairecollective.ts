import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default async function vestiaireCollective(string: string) {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=1150,750`]
    });
    const page = await browser.newPage();
    const url = `https://www.vestiairecollective.com/search/?q=${string.replace(/ /g, "+")}`;
    console.log(url);
    await page.goto(url);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const items = $('.product-card_productCard__2JCqK').map(function() {
        return {
            brand: $('.product-card_productCard__text--brand__f21Zb', this).text(),
            name: $('.product-card_productCard__text--name__EXUOr', this).text(),
            price: +$('.product-card_productCard__text--price___l1Dn', this).text()?.match(/\$([\d,]+\.\d{2})/)?.[1]?.replace(/,/g, ''),
            link: $(this).attr('href')
        }
    }).get();
    await browser.close();
    return items;
}
