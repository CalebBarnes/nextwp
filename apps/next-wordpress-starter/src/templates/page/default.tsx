import { FlexibleContent } from "@nextwp/core";
import type { WpPage, TemplateProps } from "@nextwp/core";
import * as blocks from "../../components/blocks";

interface DefaultTemplateProps extends TemplateProps {
  data: PageData;
}

interface PageData extends WpPage {
  acf?: {
    modules?: any[];
  };
}

export default function DefaultPageTemplate({ data }: DefaultTemplateProps) {
  if (!data.acf?.modules) {
    return null;
  }
  return <FlexibleContent blocks={blocks} rows={data.acf.modules} />;
}
