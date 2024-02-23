import dotenv from "dotenv";
import { getPageData } from "../src/api/get-page-data/get-page-data";

dotenv.config({
  path: ".env.local",
});

describe("Page Data Tests", () => {
  test("get blog page", async () => {
    const blogPageData = await getPageData("/blog");

    expect(blogPageData.data).toBeDefined();
  });

  test("get home page", async () => {
    const frontPage = await getPageData("/");
    // expect(
    //   frontPage.data.id === mockSiteSettings.page_on_front
    // ).toBeTruthy();

    expect(frontPage.data).toBeDefined();
  });
});
