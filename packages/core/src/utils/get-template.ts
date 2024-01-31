import type { WpPage } from "../types";
import type { PostType } from "../api/get-post-types";
import type {
  RouteParams,
  SearchParams,
} from "../components/wordpress-template";
import type { ArchivePageData } from "../api/get-page-data/get-archive-page";
import type { Taxonomy } from "../api/get-taxonomies";
import type { WpTerm } from "../api/taxonomy/get-term";
import { debug } from "./debug-log";

export interface TemplateProps {
  uri: string;
  data?: WpPage | ArchivePageData | undefined;
  archive?: PostType | undefined;
  taxonomy?: Taxonomy;
  term?: WpTerm;
  isPreview?: boolean;
  params?: RouteParams;
  searchParams?: SearchParams;
}

export type Templates = Record<
  string,
  Record<string, React.ComponentType<any>>
>;

type GetTemplateArgs = {
  uri: string;
  data: WpPage | ArchivePageData | undefined;
  archive?: PostType | undefined;
  templates: Templates;
  supressWarnings?: boolean;
  taxonomy?: Taxonomy;
  term?: WpTerm;
};

/**
 * Get the template for a given uri
 */
export function getTemplate({
  uri,
  data,
  archive,
  taxonomy,
  templates,
  supressWarnings,
}: GetTemplateArgs): React.ComponentType<TemplateProps> | undefined {
  const shouldLog = process.env.NODE_ENV === "development" && !supressWarnings;

  if (taxonomy?.slug) {
    const taxSlug = taxonomy.slug === "post_tag" ? "tag" : taxonomy.slug;


    if (!templates.taxonomy) {
      return
    }
    if (taxSlug && !(taxSlug in templates.taxonomy)) {
      if (shouldLog) {
        debug.warn(
          `No templates found for taxonomy "${taxSlug}" on uri '${uri}'.\n Did you forget to add it to the templates object in src/templates/index?`
        );
      }
      return;
    }

    const templateName = getTemplateName(taxSlug);
    const template = templates.taxonomy[taxSlug];

    if (!template && shouldLog) {
      debug.warn(
        `Template "${templateName}" not found for taxonomy "${taxSlug}" on uri '${uri}'.\n Did you forget to add it to the templates object in src/templates/index?`
      );
      return;
    }
    return template;
  }

  if (archive?.slug) {

    const templateName = getTemplateName(archive.slug);
    const template = templates.archive[templateName];

    if (!template && shouldLog) {
      debug.warn(
        `Archive template "${archive.slug}" not found on uri '${uri}'.\n Did you forget to add it to the templates object in src/templates/index?`
      );
      return;
    }

    return template;
  }


  if (!archive && data && typeof data.template === "string") {
    if (data.type && !(data.type in templates)) {
      if (shouldLog) {
        debug.warn(
          `No templates found for type "${data.type}" on uri '${uri}'.\n Did you forget to add it to the templates object in src/templates/index?`
        );
      }
      return;
    }
    const templateName = getTemplateName(data.template || "default");
    const template = templates[data.type][templateName];

    if (!template && shouldLog) {
      debug.warn(
        `Template "${templateName}" not found for type "${data.type}" on uri '${uri}'.\n Did you forget to add it to the templates object in src/templates/index?`
      );
      return;
    }

    return template;
  }
}

function getTemplateName(filename: string): string {
  let templateName = filename;

  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex !== -1) {
    templateName = filename.substring(0, dotIndex);
  }

  templateName = templateName
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  templateName = templateName.charAt(0).toLowerCase() + templateName.slice(1);

  return templateName;
}
