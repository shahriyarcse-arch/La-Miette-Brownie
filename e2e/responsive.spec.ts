import { test, expect } from "@playwright/test";

test.describe("La Miette Bakes - Responsive Layout & Mobile Navigation", () => {
  test("should display mobile menu drawer on small viewports and lock scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.locator(".fixed.z-\\[10000\\]").waitFor({ state: "detached", timeout: 10000 }).catch(() => {});

    const hamburgerBtn = page.locator("header button[aria-label='Toggle menu']");
    await expect(hamburgerBtn).toBeVisible();

    await hamburgerBtn.click();
    const mobileDrawer = page.locator("nav.flex.flex-col");
    await expect(mobileDrawer).toBeVisible();

    // Verify body scroll lock is applied
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe("hidden");

    // Close menu
    await hamburgerBtn.click();
    await expect(mobileDrawer).toBeHidden();
  });

  test("should render location switcher cleanly across responsive breakpoints", async ({ page }) => {
    await page.goto("/");
    await page.locator(".fixed.z-\\[10000\\]").waitFor({ state: "detached", timeout: 10000 }).catch(() => {});
    const locationsSection = page.locator("#locations");
    await locationsSection.scrollIntoViewIfNeeded();

    const dhanmondiTab = locationsSection.getByRole("button", { name: "Dhaka South" });
    await expect(dhanmondiTab).toBeVisible();
    await dhanmondiTab.click();
    await expect(locationsSection.getByText("Dhanmondi Dessert Studio")).toBeVisible();
  });
});
