import { cookies, draftMode } from "next/headers";
import { NextRequest } from "next/server";

interface RouteHandlerContext {
  params: { preview: string[] };
}

type PreviewOptions = {
  toolbar: boolean;
};

function NextWordPressPreview(options: PreviewOptions): any;
function NextWordPressPreview(
  req: NextRequest,
  res: RouteHandlerContext,
  options: PreviewOptions
): any;

/** The main entry point to next-wordpress-preview */
function NextWordPressPreview(
  ...args:
    | [PreviewOptions]
    | Parameters<typeof NextWordPressPreviewRouteHandler>
) {
  if (args.length === 1) {
    return async (req: NextRequest, res: RouteHandlerContext) => {
      if ((res as any)?.params) {
        return await NextWordPressPreviewRouteHandler(
          req as NextRequest,
          res as RouteHandlerContext,
          args[0]
        );
      }
    };
  }

  if ((args[1] as any)?.params) {
    return NextWordPressPreviewRouteHandler(
      ...(args as Parameters<typeof NextWordPressPreviewRouteHandler>)
    );
  }
}

export { NextWordPressPreview };

export async function NextWordPressPreviewRouteHandler(
  request: Request,
  context: RouteHandlerContext,
  options: PreviewOptions
) {
  if (context.params.preview?.[0] === "preview") {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const uri = searchParams.get("uri");
    const id = searchParams.get("id");
    const rest_base = searchParams.get("rest_base");
    const iframeToolbar = searchParams.get("toolbar");

    if (secret !== process.env.NEXT_PREVIEW_SECRET) {
      return new Response(
        "Invalid preview token. Check 'NEXT_PREVIEW_SECRET' environment variable.",
        {
          status: 401,
        }
      );
    }

    if (!uri && !id) {
      return new Response("Missing uri and/or id", { status: 401 });
    }

    draftMode().enable();

    // this is a temporary fix to get it working in an iframe
    // until Next.js changes the sameSite setting for the draft cookie
    const draft = cookies().get("__prerender_bypass");
    //@ts-ignore
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
  } else if (context.params.preview?.[0] === "disable-draft") {
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
  } else {
    return new Response("Not Found " + context.params.preview?.[0], {
      status: 404,
    });
  }
}
