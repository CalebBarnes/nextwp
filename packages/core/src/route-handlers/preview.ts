import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";

interface RouteHandlerContext {
  params: { preview: string[] };
}

type PreviewOptions = {
  toolbar: boolean;
};

/**
 * This preview route handler should be exported as `GET` from `src/app/api/draft/[...preview]/route.ts`.
 *
 * Requires the NextWP Toolkit plugin to be
 * installed and activated in WordPress to enable previews.
 * Read the docs for more info:
 * @see https://www.nextwp.org/packages/nextwp/core/route-handlers#preview
 *
 * @example
 * ```ts
 * // src/app/api/draft/[...preview]/route.ts
 * export { preview as GET } from '@nextwp/core'
 * ```
 */
function preview(options: PreviewOptions): any;
function preview(
  req: NextRequest,
  res: RouteHandlerContext,
  options: PreviewOptions
): any;

/** The main entry point to nextwp preview */
function preview(
  ...args: [PreviewOptions] | Parameters<typeof previewRouteHandler>
) {
  if (args.length === 1) {
    return async (req: NextRequest, res: RouteHandlerContext) => {
      if ((res as any)?.params) {
        return previewRouteHandler(req, res, args[0]);
      }
    };
  }

  if ((args[1] as any)?.params) {
    return previewRouteHandler(
      ...(args as Parameters<typeof previewRouteHandler>)
    );
  }
}

// todo: remove this deprecated export in the next release
export function NextWordPressPreview(...args: Parameters<typeof preview>) {
  // eslint-disable-next-line no-console -- this is a deprecated export
  console.warn(
    "The import named 'NextWordPressPreview' is deprecated, please import 'preview' from @nextwp/core instead"
  );
  return preview(...args);
}

export { preview };
export default preview;

function previewRouteHandler(
  request: Request,
  context: RouteHandlerContext,
  options: PreviewOptions
) {
  if (context.params.preview[0] === "preview") {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const uri = searchParams.get("uri");
    const id = searchParams.get("id");
    const rest_base = searchParams.get("rest_base");
    const iframeToolbar = searchParams.get("toolbar");

    if (secret !== process.env.NEXT_PREVIEW_SECRET) {
      return new Response(
        "Invalid preview token. Check that your 'NEXT_PREVIEW_SECRET' environment variable matches the one in the NextWP Toolkit plugin settings.",
        {
          status: 401,
        }
      );
    }

    if (!uri && !id) {
      return new Response("Missing uri and/or id", { status: 401 });
    }

    draftMode().enable();

    // this is a temporary fix to get draft mode working in an iframe
    // until Next.js changes the sameSite setting for the draft cookie
    const draft = cookies().get("__prerender_bypass");
    // @ts-expect-error -- this is a temporary fix
    cookies().set("__prerender_bypass", draft?.value, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    });

    let toolbarOption = false;
    if (iframeToolbar === "false") {
      toolbarOption = false;
    } else if (options.toolbar) {
      toolbarOption = true;
    }

    let path = uri;
    if (id) {
      path = `/private/${rest_base}/${id}`;
    }

    return new Response(null, {
      status: 307,
      headers: {
        Location: `${path}?toolbar=${toolbarOption ? "true" : "false"}`,
      },
    });
  } else if (context.params.preview[0] === "disable-draft") {
    const { searchParams } = new URL(request.url);
    draftMode().disable();

    const uri = searchParams.get("uri");

    if (!uri) {
      return new Response("Missing uri", { status: 401 });
    }

    return new Response(null, {
      status: 307,
      headers: {
        Location: uri === "/" ? "/" : `/${uri}`,
      },
    });
  }

  return new Response(`Not Found ${context.params.preview[0]}`, {
    status: 404,
  });
}
