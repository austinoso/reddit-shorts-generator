import { Browser, launch } from "puppeteer";

export default class Screenshoter {
  private browser: Browser;
  private page: any;

  constructor() {
    this.browser = null;
    this.page = null;
  }

  public async init() {
    this.browser = await launch({
      executablePath: "/usr/bin/chromium-browser",
    });
  }

  public async screenshotPage(url: string) {
    const page = await this.browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({
      path: "./tmp/screenshot.png",
    });
    await page.close();
    return screenshot;
  }

  public async close() {
    console.log("Closing browser...");
    await this.browser.close();
  }

  public async gotoPage(url: string) {
    const page = await this.browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    this.page = page;
  }

  public async takeScreenshotOfComment(id: string) {
    const page = this.page;
    const element = await page.$(`#${id}`);
    try {
      await element.screenshot({
        path: `./tmp/screenshot-${id}.png`,
      });
    } catch (e) {
      console.log("Error taking screenshot of comment", e);
    }
  }
}
