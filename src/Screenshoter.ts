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

  public async takeScreenshotOfElement(selector: string, savePath: string) {
    const page = this.page;
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    try {
      await element.screenshot({
        path: savePath,
      });
    } catch (e) {
      console.log("Error taking screenshot of element: " + selector, e);
    }
  }

  public async takeScreenshotOfComment(id: string, postId: string) {
    const selector = `#${id}`;
    const savePath = `./tmp/${postId}/comments/${id}.png`;
    await this.takeScreenshotOfElement(selector, savePath);
  }

  public async takeScreenshootfTitle(postId: string) {
    const selector = '[data-test-id="post-content"]';
    const savePath = `./tmp/${postId}/title.png`;
    await this.takeScreenshotOfElement(selector, savePath);
  }
}
