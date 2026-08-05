import { test, expect } from "@playwright/test";

test.describe("La Miette Brownie - SEO, Image Loading & Console Hygiene", () => {
  test("should have correct page title and Meta OpenGraph tags", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/La Miette Brownie • Luxury Dessert Boutique/);

    const ogTitle = await page.locator("meta[property='og:title']").getAttribute("content");
    expect(ogTitle).toContain("La Miette Brownie");

    const metaDescription = await page.locator("meta[name='description']").getAttribute("content");
    expect(metaDescription).toContain("Dhaka");
  });

  test("should detect zero uncaught page runtime errors on load", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (exception) => {
      pageErrors.push(exception.message);
    });

    await page.goto("/");
    expect(pageErrors).toHaveLength(0);
  });

  test("should ensure all rendered image tags load with valid natural dimensions", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Scroll down gradually to trigger lazy-loaded images
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(2000);

    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const isLoaded = await img.evaluate((element: HTMLImageElement) => {
        return element.complete && (element.naturalWidth > 0 || element.getAttribute("src")?.startsWith("data:image"));
      });
      const src = await img.getAttribute("src");
      expect(isLoaded, `Image src failed to load: ${src}`).toBe(true);
    }
  });
});
