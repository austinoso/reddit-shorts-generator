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
    const selector = `#${id}`;
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    try {
      await element.screenshot({
        path: `./tmp/comment-${id}.png`,
      });
    } catch (e) {
      console.log("Error taking screenshot of comment: " + id, e);
    }
  }

  public async takeScreenshootfTitle() {
    const page = this.page;
    const selector = '[data-test-id="post-content"]';
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    try {
      await element.screenshot({
        path: `./tmp/title.png`,
      });
    } catch (e) {
      console.log("Error taking screenshot of title", e);
    }
  }
}
