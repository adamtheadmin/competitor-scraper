"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio_1 = __importDefault(require("cheerio"));
function searchTheRealReal(string) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            headless: false,
            args: [`--window-size=1150,750`]
        });
        const page = yield browser.newPage();
        const url = `https://www.therealreal.com/products?keywords=${string.replace(/ /g, "+")}`;
        console.log(url);
        yield page.goto(url);
        const htmlContent = yield page.content();
        const $ = cheerio_1.default.load(htmlContent);
        const items = $('.product-card').map(function () {
            var _a, _b, _c;
            return {
                brand: $('.product-card__brand', this).text(),
                name: $('.product-card__description', this).text(),
                price: +((_c = (_b = (_a = $('.product-card__msrp', this).text()) === null || _a === void 0 ? void 0 : _a.match(/\$([\d,]+\.\d{2})/)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.replace(/,/g, '')),
                link: 'https://www.therealreal.com' + $(this).attr('href')
            };
        }).get();
        yield browser.close();
        return items;
    });
}
exports.default = searchTheRealReal;
