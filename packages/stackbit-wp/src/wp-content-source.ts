import {
  getVersion,
  type ContentSourceInterface,
  Version,
  Schema,
  Document,
  Asset,
} from "@stackbit/types";
import { getSiteSettings } from "@nextwp/core";

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
  constructor(options: {
    projectId: string;
    wpUrl: string;
    wpApplicationPassword: string;
  }) {
    this.projectId = options.projectId;
    this.wpApplicationPassword = options.wpApplicationPassword;
    this.wpUrl = options.wpUrl;
  }

  getContentSourceType(): string {
    return "wordpress";
  }

  getProjectId(): string {
    return this.projectId;
  }

  async init(): Promise<void> {
    // initialize the content source for example, fetch the site's settings
    // perhaps initialize the a webhook to listen for updates?
    this.settings = await getSiteSettings();
  }

  getVersion(): Promise<Version> {
    return getVersion({
      contentSourceVersion: "1.0.0",
    });
  }

  async getSchema(): Promise<Schema<SchemaContext>> {
    // const models = await this.apiClient.getModels();
    // const locales = await this.apiClient.getLocales();
    // const stackbitModels = convertToStackbitModels(models);
    // const stackbitLocales = convertToStackbitLocales(locales);
    return {
      models: [],
      locales: [],
      context: {
        customProp: "foo",
      },
    };
  }

  async getDocuments(): Promise<Document<DocumentContext>[]> {
    // const documents = await this.apiClient.getDocuments();
    // const stackbitDocuments = convertToStackbitDocuments(documents);
    return [];
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
