'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
  }>
}

function useInitialValue<T>(value: T, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}: {
  href: string
  children: React.ReactNode
  tag?: string
  active?: boolean
  isAnchorLink?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation(),
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup
  className?: string
}) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation,
  )

  let isActiveGroup =
    group.links.findIndex((link) => link.href === pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigation: Array<NavGroup> = [
  {
    title: 'Guides',
    links: [
      { title: 'Introduction', href: '/' },
      { title: 'Quickstart', href: '/quickstart' },
      // {
      //   title: 'Adding Dynamic Routes',
      //   href: '/guide/adding-dynamic-routes',
      // },
      // {
      //   title: 'Resolving Page Templates',
      //   href: '/guide/resolving-page-templates',
      // },
      // {
      //   title: 'Adding Post Types',
      //   href: '/guide/add-custom-post-types',
      // },
      // {
      //   title: 'Adding Taxonomies',
      //   href: '/guide/add-custom-taxonomies',
      // },
      // {
      //   title: 'Adding Custom Fields',
      //   href: '/guide/add-custom-fields',
      // },
      // {
      //   title: 'Adding Blocks',
      //   href: '/guide/add-blocks',
      // },
      // {
      //   title: 'Adding Blocks',
      //   href: '/guide/add-blocks',
      // },
    ],
  },

  {
    title: 'Reference',
    links: [
      {
        title: 'Components',
        href: '/packages/nextwp/core/components',
      },
      {
        title: 'REST API Functions',
        href: '/packages/nextwp/core/functions',
      },
      {
        title: 'Next App Functions',
        href: '/packages/nextwp/core/next-app-functions',
      },

      {
        title: 'Route Handlers',
        href: '/packages/nextwp/core/route-handlers',
      },
      { title: 'Environment Variables', href: '/environment-variables' },
    ],
  },
  {
    title: 'Packages',

    links: [
      { title: 'Overview', href: '/packages' },
      { title: '@nextwp/core', href: '/packages/nextwp/core' },
      { title: '@nextwp/addons', href: '/packages/nextwp/addons' },
      // { title: '@nextwp/stackbit', href: '/packages/nextwp/stackbit' },
      {
        title: 'create-nextwp-app',
        href: '/packages/create-nextwp-app',
      },
    ],
  },
  {
    title: 'WordPress',
    links: [
      // { title: 'Overview', href: '/packages' },

      {
        title: 'NextWP Headless Theme',
        href: '/packages/wordpress/nextwp-headless-theme',
      },
      {
        title: 'NextWP Toolkit',
        href: '/packages/wordpress/nextwp-toolkit-plugin',
      },
      {
        title: 'ACF to Stackbit Fields',
        href: '/packages/wordpress/acf-to-stackbit-fields',
      },
    ],
  },

  {
    title: 'Frequently Asked Questions',
    links: [
      // {
      //   title: 'Hosting for NextWP site?',
      //   href: '/faq/hosting',
      // },
      {
        title: 'Why use the REST API?',
        href: '/faq/why-rest-api',
      },
    ],
  },
]

// todo: remove this and remove all of these page.mdx files when we no longer need the examples
if (process.env.NODE_ENV === 'development') {
  navigation.push({
    title: 'Dev: Example API Docs',
    links: [
      { title: 'Contacts', href: '/contacts' },
      { title: 'Conversations', href: '/conversations' },
      { title: 'Messages', href: '/messages' },
      { title: 'Groups', href: '/groups' },
      { title: 'Attachments', href: '/attachments' },
    ],
  })
}

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/api">API</TopLevelNavItem>
        {/* <TopLevelNavItem href="#">Documentation</TopLevelNavItem> */}
        {/* <TopLevelNavItem href="#">Support</TopLevelNavItem> */}
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
        {/* <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li> */}
      </ul>
    </nav>
  )
}
