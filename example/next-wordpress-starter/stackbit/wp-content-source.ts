import {
  getVersion,
  type ContentSourceInterface,
  type Version,
  type Schema,
  type Document,
  type Asset,
  type Model,
  // ContentChanges,
  // ContentEngineConfig,
  // DocumentVersion,
  // DocumentVersionWithDocument,
  // ScheduledAction,
  // ScheduledActionActionType,
  // UpdateOperation,
  // UpdateOperationField,
  // User,
  // ValidationError,
} from "@stackbit/types";
import { getSiteSettings } from "./api/get-site-settings";
import { getAllItems } from "./api/get-all-items";
import { getPostTypes } from "./api/get-post-types";
import { convertPostStatusToDocumentStatus } from "./utils/convert-post-status";
import { getAuthHeaders } from "./api/get-auth-headers";
import { generateStackbitFieldsFromACF } from "./utils/generate-stackbit-acf-fields";

interface DocumentContext {
  customProp: string;
}
interface SchemaContext {
  customProp: string;
}

interface AssetContext {
  customProp: string;
}

export class WpContentSource
  implements ContentSourceInterface<SchemaContext, DocumentContext>
{
  projectId: string;
  wpUrl: string;
  wpApplicationPassword: string;
  settings: any;
  postTypes: string[];
  constructor(options: {
    projectId: string;
    wpUrl: string;
    wpApplicationPassword: string;
    postTypes: string[];
  }) {
    this.projectId = options.projectId;
    this.wpApplicationPassword = options.wpApplicationPassword;
    this.wpUrl = options.wpUrl;
    this.postTypes = options.postTypes;
  }

  getContentSourceType(): string {
    return "wordpress";
  }

  getProjectId(): string {
    return this.projectId;
  }

  getProjectEnvironment(): string {
    return "master";
  }

  async hasAccess(): Promise<{
    hasConnection: boolean;
    hasPermissions: boolean;
  }> {
    const siteSettings = await getSiteSettings({
      wpUrl: this.wpUrl,
      wpApplicationPassword: this.wpApplicationPassword,
    });

    if (siteSettings?.url) {
      return Promise.resolve({
        hasConnection: true,
        hasPermissions: true,
      });
    }
    return Promise.resolve({
      hasConnection: false,
      hasPermissions: false,
    });
  }

  async init(): Promise<void> {
    this.settings = await getSiteSettings({
      wpUrl: this.wpUrl,
      wpApplicationPassword: this.wpApplicationPassword,
    });
  }

  getVersion(): Promise<Version> {
    return getVersion({
      contentSourceVersion: "1.0.0",
    });
  }

  async getSchema(): Promise<Schema<SchemaContext>> {
    const postTypes = await getPostTypes({
      wpUrl: this.wpUrl,
      wpApplicationPassword: this.wpApplicationPassword,
    });

    const activePostTypes = [];

    for (const key in postTypes) {
      if (this.postTypes.includes(postTypes[key].rest_base)) {
        const sampleItem = await fetch(
          `${this.wpUrl}/wp-json/wp/v2/${postTypes[key].rest_base}?per_page=1&acf_format=standard`,
          {
            method: "OPTIONS",
            headers: getAuthHeaders(this.wpApplicationPassword),
          }
        );

        const sampleItemData = await sampleItem.json();
        const acfStackbitFields = generateStackbitFieldsFromACF(sampleItemData);

        activePostTypes.push({ ...postTypes[key], acfStackbitFields });
      }
    }

    const models: Model[] = activePostTypes?.map((item) => {
      return {
        name: item.slug,
        label: item.labels?.singular_name || item.rest_base,
        type: "page",
        urlPath: `{id}`,
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
          },
          {
            type: "string",
            name: "path",
            readOnly: true,
            label: "Url Path",
          },
          ...item.acfStackbitFields,
          // {
          //   type: "list",
          //   name: "blocks",
          //   label: "Blocks",
          //   items: {
          //     type: "object",
          //     fields: [
          //       {
          //         type: "string",
          //         name: "title",
          //         label: "Title",
          //       },
          //       {
          //         type: "string",
          //         name: "content",
          //         label: "Content",
          //       },
          //       {
          //         type: "string",
          //         name: "image",
          //         label: "Image",
          //       },
          //     ],
          //   },
          // },
        ],
      };
    });

    return {
      models,
      context: {
        customProp: "customProp",
      },
    };
  }

  async getDocuments(): Promise<Document[]> {
    const items = await getAllItems(this.postTypes, {
      wpUrl: this.wpUrl,
      wpApplicationPassword: this.wpApplicationPassword,
    });

    const documents: Document[] = items.map((item): Document => {
      const path = item.link.replace(this.wpUrl, "").replace(/\/$/, "");

      return {
        type: "document",
        id: String(item.id),
        manageUrl: `${this.wpUrl}/wp-admin/post.php?post=${item.id}&action=edit`,
        modelName: item.type,
        // path,
        status: convertPostStatusToDocumentStatus(item.status),
        createdAt: item.date,
        createdBy: item.author,
        updatedAt: item.modified,
        updatedBy: item.modified_by,
        context: {
          customProp: "customProp",
        },
        fields: {
          title: {
            type: "string",
            value: item.title?.rendered,
          },

          path: {
            type: "string",
            value: path,
          },
        },
      };
    });

    return documents;
  }

  async getAssets(): Promise<Asset<AssetContext>[]> {
    // const assets = await this.apiClient.getAssets();
    // const stackbitAssets = convertToStackbitAssets(assets);
    return [];
  }

  getProjectManageUrl(): string {
    return `${this.wpUrl}/wp-admin`;
  }
}
