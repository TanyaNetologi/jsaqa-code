import {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import puppeteer from "puppeteer";
import assert from "node:assert";

let browser;
let page;

setDefaultTimeout(30000);

Before(async function () {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  page = await browser.newPage();
});

After(async function () {
  await browser.close();
});

Given("пользователь находится на странице кинотеатра", async function () {
  await page.goto("http://qamid.tmweb.ru/client/index.php");
  await page.waitForSelector(".movie-seances__time");
});

When("пользователь выбирает сеанс", async function () {
  await page.click(".movie-seances__time");
  await page.waitForSelector(".buying-scheme__chair");
});

When("пользователь выбирает одно свободное место", async function () {
  const freeChair = await page.$(
    ".buying-scheme__chair:not(.buying-scheme__chair_taken)",
  );

  await freeChair.click();
});

When("пользователь выбирает два свободных места", async function () {
  const freeChairs = await page.$$(
    ".buying-scheme__chair:not(.buying-scheme__chair_taken)",
  );

  await freeChairs[0].click();
  await freeChairs[1].click();
});

When("пользователь не выбирает место", async function () {
  await page.waitForSelector(".acceptin-button");
});

Then("кнопка бронирования активна", async function () {
  const button = await page.$(".acceptin-button");
  const isDisabled = await button.evaluate((element) => element.disabled);

  assert.strictEqual(isDisabled, false);
});

Then("кнопка бронирования неактивна", async function () {
  const button = await page.$(".acceptin-button");
  const isDisabled = await button.evaluate((element) => element.disabled);

  assert.strictEqual(isDisabled, true);
});
