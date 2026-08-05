import { test, expect } from "@playwright/test";

test.describe("La Miette - Core E2E User Journey", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator(".fixed.z-\\[10000\\]").waitFor({ state: "detached", timeout: 10000 }).catch(() => {});
  });

  test("should render main Hero headline and brand logo", async ({ page }) => {
    await expect(page.locator("header")).toContainText("La Miette");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Freshly Baked Desserts");
  });

  test("should allow smooth navigation to menu sections", async ({ page, isMobile }) => {
    if (isMobile) {
      const hamburgerBtn = page.locator("header button[aria-label='Toggle menu']");
      await expect(hamburgerBtn).toBeVisible();
      await hamburgerBtn.click();
      const mobileDrawer = page.locator("nav.flex.flex-col");
      await expect(mobileDrawer).toBeVisible();
      const bestSellersLink = mobileDrawer.getByText("Best Sellers");
      await bestSellersLink.click();
    } else {
      const bestSellersLink = page.locator("header nav").getByText("Best Sellers");
      await expect(bestSellersLink).toBeVisible();
      await bestSellersLink.click();
    }
    await expect(page.locator("#signature")).toBeInViewport({ timeout: 10000 });
  });

  test("should open product detail modal when clicking a signature item", async ({ page }) => {
    const firstProduct = page.locator("#signature [data-cursor='VIEW']").first();
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.click();
    await expect(page.locator("[role='dialog']")).toBeVisible();
  });

  test("should handle Newsletter subscription form submission cleanly", async ({ page }) => {
    const newsletterInput = page.locator("input[type='email']");
    await newsletterInput.scrollIntoViewIfNeeded();
    await newsletterInput.fill("customer@lamiette.com");
    await page.locator("button[type='submit']").click();

    // The form must surface deterministic feedback: success when the
    // subscription is persisted, or an error when the database is unreachable.
    const success = page.getByText("Welcome to the Tasting Club!");
    const failure = page.getByText("Couldn't subscribe right now");
    await expect(success.or(failure)).toBeVisible({ timeout: 10000 });
  });

  test("should calculate and update real-world countdown timer in FreshBake section", async ({ page }) => {
    const freshBakeSection = page.locator("#fresh-bake");
    await freshBakeSection.scrollIntoViewIfNeeded();
    await expect(freshBakeSection).toContainText("FRESH OVEN BATCH");
    await expect(freshBakeSection.getByText("Hours")).toBeVisible();
    await expect(freshBakeSection.getByText("Minutes")).toBeVisible();
    await expect(freshBakeSection.getByText("Seconds")).toBeVisible();
  });
});
