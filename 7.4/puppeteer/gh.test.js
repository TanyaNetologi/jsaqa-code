let page;

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(async () => {
  await page.close();
});

describe("Github page tests", () => {
  beforeEach(async () => {
    await page.goto("https://github.com/team");
  });

  test("The h1 header content", async () => {
    const title = await page.title();

    expect(title).toEqual(
      "GitHub for teams · Build like the best teams on the planet · GitHub",
    );
  }, 60000);

  test("The first link attribute", async () => {
    const actual = await page.$eval("a", (link) => link.getAttribute("href"));

    expect(actual).toEqual("#start-of-content");
  }, 60000);

  test("The page contains Sign up button", async () => {
    const pageContent = await page.content();

    expect(pageContent).toContain("Sign up for free");
  }, 60000);
});

describe("Other GitHub pages", () => {
  test("GitHub Enterprise page title", async () => {
    await page.goto("https://github.com/enterprise");

    const title = await page.title();

    expect(title).toContain("GitHub Enterprise");
  }, 60000);

  test("GitHub Pricing page title", async () => {
    await page.goto("https://github.com/pricing");

    const title = await page.title();

    expect(title).toContain("Pricing");
  }, 60000);

  test("GitHub Features page title", async () => {
    await page.goto("https://github.com/features");

    const title = await page.title();

    expect(title).toContain("GitHub");
  }, 60000);
});
