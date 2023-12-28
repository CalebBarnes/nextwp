import { FlexibleContent } from "@nextwp/core";
import type { WpPage } from "@nextwp/core/src/types";
import type { RowItem } from "@nextwp/core/src/components/flexible-content";
import * as blocks from "../../components/blocks";

interface PageData extends WpPage {
  acf?: {
    modules: RowItem[];
  };
}

export default function DefaultPageTemplate({ data }: { data: PageData }) {
  if (!data.acf?.modules) return null;
  return <FlexibleContent blocks={blocks} rows={data.acf.modules} />;
}
