import { FlexibleContent } from "@nextwp/core";
import type { WpPage, TemplateProps, RowItem } from "@nextwp/core";
import * as blocks from "../../components/blocks";

interface DefaultTemplateProps extends TemplateProps {
  data: PageData;
}

interface PageData extends WpPage {
  acf?: {
    modules?: BlockProps[];
  };
}

type BlockProps = RowItem;

export default function DefaultPageTemplate({ data }) {
  if (!data.acf?.modules) {
    return null;
  }

  return <FlexibleContent blocks={blocks} rows={data.acf.modules} />;
}
