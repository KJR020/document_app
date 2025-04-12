import { expect, test } from "@playwright/test";

test("should navigate to home page", async ({ page }) => {
  await page.goto("/");

  // Check if the home page is loaded
  await expect(page).toHaveURL("/");

  await expect(page).toHaveTitle("Document App");
});
