import puppeteer from 'puppeteer';

const baseUrl = 'http://localhost:5174';
const games = ['gmod']; // ['tf2', 'gmod', 'pz', 'css', 'baro', 'l4d2'];
const HEIGHT = 800;

(async () => {
    const browser = await puppeteer.launch({ headless: true });

    for (const game of games) {
        const page = await browser.newPage();
        await page.goto(`${baseUrl}?game=${game}`);
        await page.setViewport({ width: Math.floor(HEIGHT * 2.05), height: HEIGHT });
        await page.waitForNetworkIdle({ idleTime: 5000 });
        await page.screenshot({ path: `./map_${game}.png` });
        await page.close()
    }

    await browser.close();
})();