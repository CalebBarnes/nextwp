import Link from "next/link";
import Image from "next/image";
import { swapWpUrl } from "@nextwp/core/src/utils/swap-wp-url";
import { getFeaturedImage } from "@nextwp/core/src/utils/get-featured-image";
import Edges from "@/components/edges";
import Button from "@/components/ui/button";

export default function PostArchive(props) {
  // console.log(props);
  const {
    // uri,
    data: {
      posts,
      page,
      prevPage,
      nextPage,
      // totalItems,
      totalPages,
      currentPage,
    },
    // archive,
  } = props;

  // console.log({ items });
  return (
    <div>
      <h1>items: {posts.length}</h1>

      <Edges>
        <h1 className="mb-5">{page?.title?.rendered}</h1>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => {
            const featuredImage = getFeaturedImage(post);
            return (
              <article
                className="flex flex-col items-start justify-between"
                key={post.id}
              >
                <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2]">
                  {featuredImage?.url ? (
                    <Image
                      alt=""
                      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                      fill
                      src={featuredImage.url}
                    />
                  ) : null}

                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time className="text-gray-500" dateTime={post.datetime}>
                      {post.date}
                    </time>
                    {/* <a
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                      href={post.category.href}
                    >
                      {post.category.title}
                    </a> */}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={swapWpUrl(post.link)}>
                        <span className="absolute inset-0" />
                        {post.title.rendered}
                      </Link>
                    </h3>
                    <div
                      className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <img
                      alt=""
                      className="h-10 w-10 rounded-full bg-gray-100"
                      src={post?._embedded?.author?.[0]?.avatar_urls?.["96"]}
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        {/* <a href={post.author}> */}
                        <span className="absolute inset-0" />
                        {post?._embedded?.author?.[0].name}
                        {/* </a> */}
                      </p>
                      <p className="text-gray-600">{post.author.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {/* <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {items?.map((item) => (
            <li className="relative" key={item.id}>
              <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                {item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ? (
                  <Image
                    alt=""
                    className="pointer-events-none object-cover group-hover:opacity-75"
                    fill
                    src={item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                  />
                ) : null}
                <Link
                  className="absolute inset-0 focus:outline-none"
                  href={swapWpUrl(item.link)}
                  type="button"
                >
                  <span className="sr-only">
                    View details for {item.title.rendered}
                  </span>
                </Link>
              </div>

              <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                {item.title.rendered}
              </p>
              <div
                className="truncate text-clip"
                // className="pointer-events-none block text-sm font-medium text-gray-500"
                dangerouslySetInnerHTML={{ __html: item.excerpt.rendered }}
              />
            </li>
          ))}
        </ul> */}

        <div className="flex justify-between gap-x-2 border-t pt-5 mt-5 items-center">
          <span className="text-sm">
            Viewing page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-x-5">
            <div>
              {prevPage ? (
                <Button asChild>
                  <Link href={`?page=${prevPage}`}>Prev page</Link>
                </Button>
              ) : null}
            </div>

            <div>
              {nextPage ? (
                <Button asChild>
                  <Link href={`?page=${nextPage}`}>Next page</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Edges>

      {/* <p>totalPages: {totalPages}</p> */}
      {/* <p>num items on this page: {items.length}</p> */}
      {/* 
      <pre>
        <code>{JSON.stringify({ items }, null, 2)}</code>
      </pre> */}
      {/* 
      <pre>
        <code>{JSON.stringify({ page }, null, 2)}</code>
      </pre>

      <pre>
        <code>{JSON.stringify({ archive }, null, 2)}</code>
      </pre> */}
    </div>
  );
}
