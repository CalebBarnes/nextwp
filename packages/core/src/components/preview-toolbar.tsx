import React from "react";
import Link from "next/link";
import type { SearchParams } from "./wordpress-template";
import "./preview-toolbar.css";

export function PreviewToolbar({
  uri,
  searchParams,
  data,
  previewData,
}: {
  uri: string;
  searchParams?: SearchParams;
  data?: any;
  previewData?: any;
}) {
  const { toolbar } = searchParams || {};

  if (toolbar === "false") {
    return null;
  }

  const hasPreviewData = Boolean(previewData);

  return (
    <div className="previewToolbar">
      {!hasPreviewData && (
        <Link
          className="icon-button preview-tooltip-no-content-warning right"
          href={`${process.env.NEXT_PUBLIC_WP_URL}/wp-admin/post.php?post=${data?.id}&action=edit`}
          prefetch={false}
          target="_blank"
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ width: "24px", height: "24px" }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}

      <Link
        className="icon-button preview-tooltip-edit-page right"
        href={`${process.env.NEXT_PUBLIC_WP_URL}/wp-admin/post.php?post=${data?.id}&action=edit`}
        prefetch={false}
        target="_blank"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <Link
        className="icon-button preview-tooltip-exit-draft-mode right"
        href={`/api/draft/disable-draft?uri=${uri}`}
        prefetch={false}
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
