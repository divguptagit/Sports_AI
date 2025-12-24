import { test, expect } from "@playwright/test";

test("homepage has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Sports AI/);
});

test("homepage has welcome message", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome to Sports AI")).toBeVisible();
});

test("navigation works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Dashboard")).toBeVisible();
});

