import React from "react";

export interface RowItem {
  acf_fc_layout: string;
  [key: string]: any;
}

export interface FlexibleContentProps {
  /**
   * Object of React Components that will be used to render the flexible content
   */
  blocks?: Record<string, React.ComponentType<any>>;
  /**
   * Array of acf flexible content rows from the Wordpress API
   */
  rows: RowItem[];
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
  return (
    rows
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- sanitizing data, removing empty rows just in case the API returns some crap
      .filter((o) => o !== null)
      .map(({ acf_fc_layout, ...rest }: RowItem, index: number) => {
        // capitalize each word and remove underscores
        const type = acf_fc_layout
          .split(/[_-]/)
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("");

        const rowData = { type, ...rest };
        const Component = blocks?.[type];

        if (Component) {
          return (
            <Component
              firstItem={index === 0}
              // eslint-disable-next-line react/no-array-index-key -- there is no alternative
              key={index}
              {...rowData}
              {...data}
            />
          );
        }

        if (!supressWarnings) {
          // eslint-disable-next-line no-console -- this is a warning
          console.error(
            `%cReact component "${type}" was not found. Make sure the
            component exists and you are importing it.`,
            "color: red;"
          );
          return null;
        }

        return null;
      })
  );
}

export default FlexibleContent;
