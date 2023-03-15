import { Browser, launch } from "puppeteer";

export default class Screenshoter {
  private browser: Browser;

  constructor() {
    this.browser = null;
  }

  public async init() {
    console.log("Launching browser...");
    this.browser = await launch({
      executablePath: "/usr/bin/chromium-browser",
    });
  }

  public async screenshotPage(url: string) {
    console.log("Taking screenshot of page: " + url);
    const page = await this.browser.newPage();
    console.log("Navigating to page...");
    await page.goto(url);
    console.log("Taking screenshot...");
    const screenshot = await page.screenshot({
      path: "./tmp/screenshot.png",
    });
    console.log("Closing page...");
    await page.close();
    return screenshot;
  }
}
