import {
  getVersion,
  type ContentSourceInterface,
  type Version,
  type Schema,
  type Document,
  type Asset,
  Model,
  UpdateOperation,
  UpdateOperationField,
  UserSSOProfile,
  ValidationError,
} from "@stackbit/types";

import { convertPostStatusToDocumentStatus } from "./utils/convert-post-status";
import { getAllItems } from "./api/get-all-items";
import { getPostTypes } from "./api/get-post-types";
import { jsonSchemaToStackbitSchema } from "./utils/json-schema-to-stackbit-schema";
import { WpApiClient } from "./api/client";
import { toStackbitModels } from "./utils/to-stackbit-models";

interface ModelContext {}
interface DocumentContext {}
interface SchemaContext {}
interface AssetContext {}

export class WpContentSource
  implements
    ContentSourceInterface<
      unknown,
      SchemaContext,
      DocumentContext,
      ModelContext,
      unknown
    >
{
  private readonly projectId: string;
  private readonly wpUrl: string;
  private readonly applicationPassword: string;
  private apiClient!: WpApiClient;

  settings: any;
  postTypes: string[];

  constructor(options: {
    projectId: string;
    wpUrl: string;
    applicationPassword: string;
    postTypes: string[];
  }) {
    this.projectId = options.projectId;
    this.applicationPassword = options.applicationPassword;
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
    return "production";
  }

  async hasAccess(): Promise<{
    hasConnection: boolean;
    hasPermissions: boolean;
  }> {
    return Promise.resolve({
      hasConnection: true,
      hasPermissions: true,
    });
  }

  async init(): Promise<void> {
    this.apiClient = new WpApiClient({
      wpUrl: this.wpUrl,
      applicationPassword: this.applicationPassword,
    });
  }
  async reset(): Promise<void> {}
  async destroy(): Promise<void> {}

  getVersion(): Promise<Version> {
    return getVersion({
      contentSourceVersion: "1.0.0",
    });
  }

  async getModels(): Promise<Model[]> {
    const models = await this.apiClient.getModels();
    return toStackbitModels(models);
  }

  async getSchema(): Promise<Schema<SchemaContext, ModelContext>> {
    const models = await this.getModels();
    // const locales = this.getLocales();
    return {
      context: {},
      models,
      // locales
    };
  }

  async getDocuments(): Promise<Document[]> {
    const items = await getAllItems(this.postTypes, {
      wpUrl: this.wpUrl,
      applicationPassword: this.applicationPassword,
    });

    const schema = await this.getSchema();

    const documents: Document[] = items.map((item): Document => {
      const path = item.link.replace(this.wpUrl, "").replace(/\/$/, "");

      const modelSchema = schema?.models?.find(
        (model) => model.name === item.type
      );
      // const acfModelSchema = modelSchema?.fields.find(
      //   (field) => field.name === "acf"
      // );

      // const documentFields = {
      //   title: {
      //     type: "string",
      //     value: item.title?.rendered,
      //   },

      //   path: {
      //     type: "string",
      //     value: path,
      //   },
      // };

      // documentFields.acf = generateStackbitACFFieldValues(item, acfModelSchema);

      return {
        type: "document",
        id: String(item.id),
        manageUrl: `${this.wpUrl}/wp-admin/post.php?post=${item.id}&action=edit`,
        modelName: item.type,
        status: convertPostStatusToDocumentStatus(item.status),
        createdAt: item.date,
        createdBy: item.author,
        updatedAt: item.modified,
        updatedBy: item.modified_by,
        fields: {},
        context: {},
        // fields: documentFields,
      };
    });

    return documents;
  }

  async createDocument(options: {
    updateOperationFields: Record<string, UpdateOperationField>;
    model: Model;
    locale?: string;
    defaultLocaleDocumentId?: string;
    // userContext?: UserContext;
  }): Promise<{ documentId: string }> {
    throw new Error("Method not implemented.");
    // return the id of the new document
  }
  async updateDocument(options: {
    document: Document<DocumentContext>;
    operations: UpdateOperation[];
    // userContext?: UserContext;
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteDocument(options: {
    document: Document<DocumentContext>;
    // userContext?: UserContext;
  }): Promise<void> {
    // delete the document
    throw new Error("Method not implemented.");
  }

  async validateDocuments(options: {
    documents: Document<DocumentContext>[];
    assets: Asset<ModelContext>[];
    locale?: string;
    userContext?: { name: string; email: string; sso?: UserSSOProfile };
  }): Promise<{ errors: ValidationError[] }> {
    throw new Error("Method not implemented.");
  }

  async publishDocuments(options: {
    documents: Document<DocumentContext>[];
    assets: Asset<ModelContext>[];
    userContext?: { name: string; email: string; sso?: UserSSOProfile };
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getAssets(): Promise<Asset<AssetContext>[]> {
    // const assets = await this.apiClient.getAssets();
    // const stackbitAssets = convertToStackbitAssets(assets);
    return [];
  }

  async uploadAsset(options: {
    url?: string;
    base64?: string;
    fileName: string;
    mimeType: string;
    locale?: string;
    userContext?: { name: string; email: string; sso?: UserSSOProfile };
  }): Promise<Asset<ModelContext>> {
    throw new Error("Method not implemented.");
  }

  getProjectManageUrl(): string {
    return `${this.wpUrl}/wp-admin`;
  }
}
