import Link from "next/link";
import Image from "next/image";
import { swapWpUrl } from "@nextwp/core/src/utils/swap-wp-url";
import { getFeaturedImage } from "@nextwp/core/src/utils/get-featured-image";
import { stripWpUrl } from "@nextwp/core";
import type { ArchivePage } from "@nextwp/core/src/api/get-page-data/get-archive-page";
import { Badge } from "@/components/ui/badge";
import Edges from "@/components/edges";
import { ArchivePagination } from "@/components/template-parts/archive-pagination";

export function ProductArchive(props: ArchivePage) {
  if (!props.data) {
    return null;
  }

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
    <Edges>
      <h1 className="mb-5">{page?.title?.rendered}</h1>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {items?.map((item) => {
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

      {currentPage && totalPages && totalItems ? (
        <div className="flex justify-between gap-x-2 border-t pt-5 mt-5 items-center">
          <ArchivePagination
            currentPage={currentPage}
            nextPage={nextPage}
            prevPage={prevPage}
            totalItems={totalItems}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </Edges>
  );
}
