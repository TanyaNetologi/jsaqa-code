import puppeteer from "puppeteer";

let browser;
let page;

async function openFirstSession() {
  await page.waitForSelector(".movie-seances__time");
  await page.click(".movie-seances__time");
}

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
});

afterEach(async () => {
  await page.close();
});

afterAll(async () => {
  await browser.close();
});

test("Бронирование одного билета", async () => {
  // Arrange
  await openFirstSession();

  // Act
  await page.waitForSelector(".buying-scheme__chair");

  const freeChair = await page.$(
    ".buying-scheme__chair:not(.buying-scheme__chair_taken)",
  );

  await freeChair.click();

  // Assert
  const button = await page.$(".acceptin-button");
  const isDisabled = await button.evaluate((element) => element.disabled);

  expect(isDisabled).toBe(false);
});

test("Бронирование двух билетов", async () => {
  // Arrange
  await openFirstSession();

  // Act
  await page.waitForSelector(".buying-scheme__chair");

  const freeChairs = await page.$$(
    ".buying-scheme__chair:not(.buying-scheme__chair_taken)",
  );

  await freeChairs[0].click();
  await freeChairs[1].click();

  // Assert
  const button = await page.$(".acceptin-button");
  const isDisabled = await button.evaluate((element) => element.disabled);

  expect(isDisabled).toBe(false);
});

test("Нельзя забронировать билет без выбора места", async () => {
  // Arrange
  await openFirstSession();

  // Act
  await page.waitForSelector(".acceptin-button");

  // Assert
  const button = await page.$(".acceptin-button");
  const isDisabled = await button.evaluate((element) => element.disabled);

  expect(isDisabled).toBe(true);
});
