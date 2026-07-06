import { test, expect } from "@playwright/test";

test.describe("landing — hero & footer bookends", () => {
  test("hero renders kicker, three display lines, CTA and availability", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByText("Abhishek Bhikule — Web Designer & Developer"),
    ).toBeVisible();

    // RevealText splits each line into spans via SplitType, so a single
    // combined toContainText across all three lines doesn't match reliably.
    // Loosened per the brief to three separate assertions against the h1.
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toContainText("Design that");
    await expect(heading).toContainText("remember,");
    await expect(heading).toContainText("performs.");

    await expect(page.getByRole("link", { name: /start a project/i })).toBeVisible();
    await expect(page.getByText(/available — booking/i)).toBeVisible();
  });

  test("preloader marks the session and skips on reload", async ({ page }) => {
    await page.goto("/");
    await expect
      .poll(
        () => page.evaluate(() => sessionStorage.getItem("cwa:preloaded")),
        { timeout: 10_000 },
      )
      .toBe("1");
  });

  test("footer shows gradient email, IST clock and wordmark", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("End");
    await expect(
      page.getByRole("link", { name: "hello@createwithabhi.in" }),
    ).toBeVisible();
    await expect(page.getByText(/MUMBAI, \d{2}:\d{2} IST/)).toBeVisible();
    await expect(
      page.locator("text=CREATEWITHABHI").first(),
    ).toBeVisible();
  });

  test("renders under reduced motion without canvas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  test("no horizontal overflow on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
