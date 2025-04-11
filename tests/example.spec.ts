import { test, expect } from "@playwright/test";

test("should navigate to home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
});
