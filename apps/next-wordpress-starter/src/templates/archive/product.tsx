import Link from "next/link";
import Image from "next/image";
import { swapWpUrl } from "@nextwp/core/src/utils/swap-wp-url";
import { getFeaturedImage } from "@nextwp/core/src/utils/get-featured-image";
import { stripWpUrl } from "@nextwp/core";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Edges from "@/components/edges";

export default function ProductArchive(props) {
  const {
    data: {
      items,
      page,
      prevPage,
      nextPage,
      totalItems,
      totalPages,
      currentPage,
    },
  } = props;

  return (
    <div>
      <div className="edges">
        <div className="border shadow-lg p-5 inline-block rounded">
          <h4>current page items: {items?.length}</h4>
          <p>totalItems: {totalItems}</p>
          <p>totalPages: {totalPages}</p>
        </div>
      </div>

      <Edges>
        <h1 className="mb-5">{page?.title?.rendered}</h1>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {items.map((item) => {
            const featuredImage = getFeaturedImage(item);

            return (
              <article
                className="flex flex-col items-start justify-between"
                key={item.id}
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
                    <time className="text-gray-500" dateTime={item.datetime}>
                      {item.date}
                    </time>

                    {item?._embedded?.["wp:term"]?.map((tax) => {
                      return tax?.map((term, index) => {
                        return (
                          <Link href={stripWpUrl(term.link)} key={index}>
                            <Badge>{term.name}</Badge>
                          </Link>
                        );
                      });
                    })}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={swapWpUrl(item.link)}>
                        <span className="absolute inset-0" />
                        {item?.title?.rendered}
                      </Link>
                    </h3>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex justify-between gap-x-2 border-t pt-5 mt-5 items-center">
          <span className="text-sm">
            Viewing page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-x-5">
            <div>
              {prevPage ? (
                <Button asChild>
                  <Link href={prevPage}>Prev page</Link>
                </Button>
              ) : null}
            </div>

            <div>
              {nextPage ? (
                <Button asChild>
                  <Link href={nextPage}>Next page</Link>
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

function getTerms(taxonomy, item) {
  const terms = item?._embedded?.["wp:term"]?.[taxonomy]?.map((term) => {
    return {
      name: term.name,
      slug: term.slug,
      href: term.link,
    };
  });
  return terms;
}
