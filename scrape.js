const puppeteer = require('puppeteer');
const env = require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
let credentials = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(credentials);

async function scrapeContent(url) {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url);
        const textContent = await page.evaluate(() => {
            return document.documentElement.innerText;
        });
        return (textContent);
    } catch (error) {
        throw new Error(`Error scraping content from ${url}, ${error}.`);
    }
}
async function parseWithGenAi(content, prompt) {
    try {
        const generationConfig = {
            temperature: 0.7,
        };
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });
        const result = await model.generateContent(content);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        throw new Error(`Something went wrong, ${error}`);
    }
}

async function scrapeWithAI(url, prompt) {
    try {
        let content = await scrapeContent(url);
        return parseWithGenAi(content, prompt);
    } catch (error) {
        return error;
    }
}

module.exports = { scrapeWithAI }