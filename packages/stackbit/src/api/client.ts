import { getPostTypes } from "./get-post-types";

export interface WpApiClientOptions {
  wpUrl?: string;
  applicationPassword?: string;
}

export class WpApiClient {
  private readonly wpUrl: string;
  private readonly applicationPassword: string;

  constructor(options: WpApiClientOptions) {
    this.wpUrl = options.wpUrl ?? "https://example.com";
  }

  async getModels(): Promise<unknown[]> {
    const postTypes = await getPostTypes({
      wpUrl: this.wpUrl,
      applicationPassword: this.applicationPassword,
    });

    let wpModels = [];

    for (const key in postTypes) {
      if (
        key === "attachment" ||
        key === "wp_navigation" ||
        key === "nav_menu_item" ||
        key === "wp_template" ||
        key === "wp_template_part" ||
        key === "wp_block"
      ) {
        continue;
      }

      const postType = postTypes[key];
      const res = await fetch(
        `${this.wpUrl}/wp-json/wp/v2/types/${postType?.rest_base}`,
        {
          method: "OPTIONS",
        }
      );
      const data = await res.json();
      const schema = data?.schema;
      wpModels.push({
        type: key,
        schema,
      });
    }

    return wpModels;
  }

  async getDocuments(options?: {
    type?: string;
    includeEmptyFields?: boolean;
  }): Promise<unknown[]> {
    return [];
  }

  async getAssets(): Promise<unknown[]> {
    await networkDelay();
    return [];
  }
}

function networkDelay(delay: number = 200) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
