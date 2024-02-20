import Image from 'next/image'

import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import logoPhp from '@/images/logos/php.svg'
import logoGo from '@/images/logos/go.svg'
import logoNode from '@/images/logos/node.svg'

const npmPackages = [
  {
    href: '/packages/nextwp/core',
    name: '@nextwp/core',
    description:
      'A Next.js package that allows you to use WordPress as a headless CMS.',
    svg: <NextLogo />,
  },
  {
    href: '/packages/nextwp/addons',
    name: '@nextwp/addons',
    description: 'Additional components and features for NextWP.',
    svg: <NextLogo />,
  },
  {
    href: '/packages/nextwp/stackbit',
    name: '@nextwp/stackbit',
    description:
      'A WordPress content source interface that allows you to use the Stackbit Visual Editor with WordPress.',
    logo: logoNode,
  },
]

const plugins = [
  {
    href: '/packages/wordpress/nextwp-headless-theme',
    name: 'NextWP Headless Theme',
    description:
      'A WordPress theme with some good defaults that automatically installs the recommended headless plugins.',
    logo: logoPhp,
  },
  {
    href: '/packages/wordpress/nextwp-toolkit-plugin',
    name: 'NextWP Toolkit',
    description:
      'A WordPress plugin that adds NextWP specific features to your WordPress site.',
    logo: logoPhp,
  },
]

const cliTools = [
  {
    href: '/packages/create-nextwp-app',
    name: 'create-nextwp-app',
    description:
      'Create a new NextWP project in a single command with this cross platform CLI tool written in Go.',
    logo: logoGo,
  },
]

export function Libraries() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="npm-packages">
        NPM Packages
      </Heading>
      <Items items={npmPackages} />

      <Heading level={2} id="cli-tools">
        CLI Tools
      </Heading>
      <Items items={cliTools} />

      <Heading level={2} id="wordpress-themes-plugins">
        WordPress Themes & Plugins
      </Heading>
      <Items items={plugins} />
    </div>
  )
}

export function Items({
  items,
}: {
  items?: {
    href: string
    name: string
    description: string
    logo?: string
    logoWidth?: number
    logoHeight?: number
    logoPadding?: string
    svg?: React.ReactNode
  }[]
}) {
  return (
    <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
      {items?.map((item) => (
        <div key={item.name} className="flex flex-row-reverse gap-6">
          <div className="flex-auto">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {item.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>
            <p className="mt-4">
              <Button href={item.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
          {item.logo ? (
            <Image
              src={item.logo}
              alt=""
              className="h-12 w-12"
              style={{
                padding: item?.logoPadding || '',
              }}
              unoptimized
              width={item.logoWidth}
              height={item.logoHeight}
            />
          ) : null}
          {item.svg ? item.svg : null}
        </div>
      ))}
    </div>
  )
}

export function NextLogo() {
  return (
    <svg
      aria-label="Next.js logomark"
      data-theme="dark"
      height="40"
      role="img"
      viewBox="0 0 180 180"
      width="40"
      className="h-8 w-8 flex-shrink-0"
    >
      <mask
        height="180"
        id=":rd:mask0_408_134"
        maskUnits="userSpaceOnUse"
        width="180"
        x="0"
        y="0"
        style={{
          maskType: 'alpha',
        }}
      >
        <circle cx="90" cy="90" fill="black" r="90"></circle>
      </mask>
      <g mask="url(#:rd:mask0_408_134)">
        <circle
          cx="90"
          cy="90"
          data-circle="true"
          fill="black"
          r="90"
          stroke="white"
          stroke-width="6px"
        ></circle>
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#:rd:paint0_linear_408_134)"
        ></path>
        <rect
          fill="url(#:rd:paint1_linear_408_134)"
          height="72"
          width="12"
          x="115"
          y="54"
        ></rect>
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id=":rd:paint0_linear_408_134"
          x1="109"
          x2="144.5"
          y1="116.5"
          y2="160.5"
        >
          <stop stop-color="white"></stop>
          <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id=":rd:paint1_linear_408_134"
          x1="121"
          x2="120.799"
          y1="54"
          y2="106.875"
        >
          <stop stop-color="white"></stop>
          <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
