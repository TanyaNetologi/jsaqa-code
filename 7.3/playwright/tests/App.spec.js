const { test, expect } = require("@playwright/test");
const { email, password } = require("../user");

async function openEmailLoginForm(page) {
  await page.goto("https://netology.ru/?modal=sign_in");

  await page.waitForSelector('[class*="emailButton"]', {
    state: "attached",
    timeout: 30000,
  });

  await page.$eval('[class*="emailButton"]', (element) => element.click());

  await page.waitForSelector('input[name="email"]');
}

async function submitLoginForm(page, login, userPassword) {
  await page.fill('input[name="email"]', login);
  await page.fill('input[name="password"]', userPassword);

  // Реальное нажатие кнопки «Войти»
  await page.$eval('[data-testid="login-submit-btn"]', (element) =>
    element.click(),
  );
}

test("Успешная авторизация", async ({ page }) => {
  test.setTimeout(60000);

  await openEmailLoginForm(page);
  await submitLoginForm(page, email, password);

  await page.waitForURL(/\/profile\/\d+/, {
    timeout: 30000,
  });

  expect(page.url()).toMatch(/\/profile\/\d+/);

  const profileUrl = page.url();

  expect(profileUrl).toMatch(/\/profile\/\d+/);
  expect(await page.title()).not.toBe("");
});

test("Неуспешная авторизация", async ({ page }) => {
  test.setTimeout(60000);

  await openEmailLoginForm(page);

  await submitLoginForm(page, "invalid-user@example.com", "wrong-password-123");

  const errorSelector = "text=Вы ввели неправильно логин или пароль.";

  await page.waitForSelector(errorSelector, {
    state: "visible",
    timeout: 30000,
  });

  expect(await page.isVisible(errorSelector)).toBeTruthy();
});
