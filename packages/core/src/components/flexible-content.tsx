import React from "react";
import { debug } from "../utils/debug-log";

export interface Row {
  acf_fc_layout: string;
  [key: string]: any;
}
type RowItem = Row | null | undefined;

export interface FlexibleContentProps {
  /**
   * Object of React Components that will be used to render the flexible content
   */
  blocks?: Record<string, React.ComponentType<Row> | undefined>;
  /**
   * Array of acf flexible content rows from the Wordpress API
   */
  rows?: RowItem[] | null | undefined;
  /**
   * Extra data that will be passed to each individual component
   */
  data?: any;
  /**
   * Supress warnings in the console when a component is not found
   */
  supressWarnings?: boolean;
}

export function FlexibleContent({
  blocks,
  rows,
  data,
  supressWarnings,
}: FlexibleContentProps) {
  if (!rows?.length || !blocks) {
    return null;
  }

  return rows
    .filter((o) => o !== null)
    .map((row, index: number) => {
      if (!row?.acf_fc_layout) {
        return null;
      }

      // convert the layout name from snake_case or kebab-case to PascalCase
      const componentName = row.acf_fc_layout
        .split(/[_-]/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");

      const Component = blocks[componentName];

      if (Component && typeof Component !== "undefined") {
        return (
          <Component
            firstItem={index === 0}
            // eslint-disable-next-line react/no-array-index-key -- there is no unique id for the row
            key={index}
            {...row}
            {...data}
          />
        );
      }

      if (!supressWarnings && process.env.NODE_ENV !== "production") {
        debug.warn(
          `FlexibleContent: React component "${componentName}" was not found. \nMake sure you are passing "${componentName}" to "FlexibleContent" in the blocks prop.\n`
        );
      }

      return null;
    });
}

export default FlexibleContent;
