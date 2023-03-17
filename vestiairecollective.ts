import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

async function sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default async function vestiaireCollective(string: string) {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=1150,750`]
    });
    const page = await browser.newPage();
    const url = `https://us.vestiairecollective.com/search/?q=${string.replace(/ /g, "+")}`;
    console.log(url);
    await page.goto(url);
    await sleep(2500);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const items = $('.product-card_productCard__2JCqK').map(function() {
        return {
            brand: $('.product-card_productCard__text--brand__f21Zb', this).text(),
            name: $('.product-card_productCard__text--name__EXUOr', this).text(),
            price: +$('.product-card_productCard__text--price___l1Dn', this).text()?.split('$')?.pop()?.replace(/[^0-9.-]+/g,""),
            link: $('a', this).attr('href'),
            id: `vestiairecollective` + $('a', this).attr('href')?.split('-')?.pop()?.split('.')?.[0]
        }
    }).get();
    await browser.close();
    return items;
}
