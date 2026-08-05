import { test, expect } from "@playwright/test";

test.describe("Mika & Co. - Accessibility & Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator(".fixed.z-\\[10000\\]").waitFor({ state: "detached", timeout: 10000 }).catch(() => { });
  });

  test("should allow keyboard focus on header interactive elements", async ({ page }) => {
    await page.keyboard.press("Tab");
    const focusedElement = page.locator("*:focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should have valid aria-labels on icon buttons", async ({ page }) => {
    const cartButton = page.locator("header button[aria-label='View Basket']");
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toHaveAttribute("aria-label", "View Basket");
  });

  test("should respect prefers-reduced-motion media query", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator(".custom-cursor-dot").waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
    const dotCursor = page.locator(".custom-cursor-dot");
    await expect(dotCursor).toHaveCount(0);
  });
});
