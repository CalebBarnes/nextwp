import path from "node:path";
import dotenv from "dotenv";
import { http, HttpResponse, type HttpHandler } from "msw";
import { mockSiteSettings } from "./data/mock-site-settings";
import { mockFrontPage } from "./data/mock-front-page";
import { mockPostTypes } from "./data/mock-post-types";
import { mockTaxonomies } from "./data/mock-taxonomies";
import { mockPostsData } from "./data/mock-posts-data";
import { mockBlogPage } from "./data/mock-blog-page";
import { mockPagesData } from "./data/mock-pages-data";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

export const handlers: HttpHandler[] = [
  http.get(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/settings`, () => {
    return HttpResponse.json(mockSiteSettings); // getSiteSettings
  }),

  http.get(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/pages/${mockSiteSettings.page_on_front}`,
    // ?acf_format=standard&_embed=true&status=publish
    () => {
      return HttpResponse.json(mockFrontPage); // getFrontPage
    }
  ),

  http.get(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/pages/${mockSiteSettings.page_for_posts}`,
    // ?acf_format=standard&_embed=true&status=publish
    () => {
      return HttpResponse.json(mockBlogPage);
    }
  ),

  http.get(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/types`,
    // ?context=edit
    () => {
      return HttpResponse.json(mockPostTypes); // getPostTypes
    }
  ),

  http.get(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/taxonomies`, () => {
    return HttpResponse.json(mockTaxonomies); // getTaxonomies
  }),

  http.get(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts`, () => {
    return HttpResponse.json(mockPostsData);
  }),

  http.get(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/pages`, () => {
    return HttpResponse.json(mockPagesData);
  }),
];
