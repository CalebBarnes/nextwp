import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/quickstart',
    name: 'Quickstart',
    description: 'Get up and running with NextWP in minutes',
  },

  {
    href: '/packages/nextwp/core/components#wordpress-template',
    name: 'Dynamic Routes',
    description:
      'Learn how to add a catch all dynamic route to render your WordPress pages in Next.js',
  },
  // {
  //   href: '/guide/add-page-template-components',
  //   name: 'Page Template Components',
  //   description: 'Learn how to add custom page template components',
  // },
  // {
  //   href: '/guide/add-custom-post-types',
  //   name: 'Custom Post Types',
  //   description: 'Learn how to add custom post types',
  // },
  {
    href: '/packages/nextwp/core/components#flexible-content',
    name: 'Flexible Content',
    description: 'Learn how to add ACF flexible content to a page template',
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
