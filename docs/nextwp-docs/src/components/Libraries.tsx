import Image from 'next/image'

import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import logoPhp from '@/images/logos/php.svg'

const libraries = [
  {
    href: '#',
    name: '@nextwp/core',
    description:
      'A Next.js package that allows you to use WordPress as a headless CMS.',
    svg: (
      <svg
        aria-label="Next.js logomark"
        data-theme="dark"
        height="40"
        role="img"
        viewBox="0 0 180 180"
        width="40"
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
    ),
  },
  {
    href: '#',
    name: '@nextwp/addons',
    description: 'Addons for @nextwp/core additional components and features.',

    svg: (
      <svg
        aria-label="Next.js logomark"
        data-theme="dark"
        height="40"
        role="img"
        viewBox="0 0 180 180"
        width="40"
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
    ),
  },
  {
    href: '#',
    name: '@nextwp/stackbit',
    description:
      'A WordPress content source interface that allows you to use the Stackbit Visual Editor with WordPress.',
    // logo: logoNode,
    svg: (
      <svg
        className="logo"
        width="161"
        height="40"
        viewBox="0 0 161 40"
        fill="none"
      >
        <path
          d="M86.614 19.93c0 2.345 1.066 3.624 2.984 3.624 1.706 0 2.346-.853 2.559-1.705l.213-.214h1.706l.213.213c-.213 1.92-1.706 3.625-4.69 3.625-3.199 0-5.118-2.132-5.118-5.543 0-3.412 1.92-5.544 5.117-5.544 2.985 0 4.478 1.706 4.69 3.625l-.212.213H92.37l-.213-.213c-.213-.853-.853-1.706-2.559-1.706-1.918 0-2.984 1.28-2.984 3.625Zm15.767-3.625-.213.213h-1.067c-1.705 0-2.771.64-2.771 3.198v5.33l-.213.214H96.41l-.213-.213V14.813l.213-.213h1.492l.214.213.213.852h.213c.64-.64 1.28-1.065 2.772-1.065h.853l.213.213v1.492Zm7.672 2.772.213-.213c0-.64-.213-2.559-2.558-2.559-2.346 0-2.559 1.919-2.559 2.559l.213.213h4.691Zm-2.132 6.396c-3.412 0-5.117-2.345-5.117-5.543 0-2.985 1.492-5.544 4.904-5.544 3.411 0 4.903 2.559 4.903 5.544v.64l-.213.212h-7.036l-.213.214c0 .426.213 2.558 2.772 2.558.853 0 1.705-.213 2.132-1.28l.213-.212h1.706l.213.213c-.213 1.706-1.706 3.198-4.264 3.198Zm14.914-.426-.213.213h-1.492l-.214-.213-.213-.853h-.213c-.704.853-1.812 1.279-2.985 1.279-2.367 0-3.624-1.28-3.624-3.411 0-2.346 1.897-3.412 4.69-3.412.64 0 1.386.107 1.919.214l.213-.214v-.426c0-1.514-.618-1.919-2.132-1.919-1.514 0-2.132.427-2.132 1.28l-.213.213h-1.706l-.213-.214c0-1.492 1.066-3.198 4.264-3.198 3.198 0 4.264 1.514 4.264 4.69v5.97Zm-2.132-3.625v-.64l-.213-.213a6.429 6.429 0 0 0-1.706-.213c-1.94 0-2.771.618-2.771 1.706 0 1.087.639 1.492 1.918 1.492 1.706 0 2.772-.853 2.772-2.132Zm10.239 3.625-.213.213h-1.706c-1.492 0-2.985-.853-2.985-2.772v-5.756l-.213-.214h-1.492l-.214-.213v-1.492l.214-.213h1.492l.213-.214v-1.919l.213-.213h1.706l.213.213v1.92l.214.213h2.345l.213.213v1.492l-.213.213h-2.345l-.214.213v5.757c0 .64.427.853.853.853h1.706l.213.213v1.493Zm8.323-5.97.213-.213c0-.64-.213-2.559-2.559-2.559-2.345 0-2.558 1.919-2.558 2.559l.213.213h4.691Zm-2.133 6.396c-3.411 0-5.116-2.345-5.116-5.543 0-2.985 1.492-5.544 4.903-5.544 3.412 0 4.904 2.559 4.904 5.544v.64l-.213.212h-7.036l-.213.214c0 .426.213 2.558 2.771 2.558.853 0 1.706-.213 2.133-1.28l.213-.212h1.705l.214.213c-.214 1.706-1.706 3.198-4.265 3.198Z"
          fill="#778089"
        ></path>
        <path
          d="M22.422 39.79V29.687l.209-.21h2.526l.21.21V39.79l-.21.209h-2.526l-.21-.21ZM22.422 10.314V.21L22.63 0h2.526l.21.21v10.104l-.21.21h-2.526l-.21-.21ZM13.727 32.687h-.347l-1.737-1.738v-.347l3.256-3.26 1.839.004.245.242v1.84l-3.256 3.259ZM11.643 9.49v-.35l1.737-1.735h.347l3.256 3.256v1.836l-.245.248h-1.84L11.644 9.49ZM.21 18.524h14.315l.21.21v2.53l-.21.209H.21L0 21.262v-2.53l.21-.209Z"
          fill="#05BDBA"
        ></path>
        <path
          d="M28.632 25.265h-2.526l-.21-.21v-5.912c0-1.054-.412-1.869-1.681-1.895-.655-.016-1.4 0-2.2.033l-.12.12v7.651l-.21.21H19.16l-.21-.21V14.948l.21-.21h5.684a3.998 3.998 0 0 1 3.999 3.999v6.315l-.21.21v.003ZM40.867 20.841l-.21.21h-6.53l-.21.209c0 .422.422 1.685 2.107 1.685.632 0 1.263-.21 1.476-.631l.21-.21h2.526l.209.21c-.21 1.263-1.263 3.16-4.424 3.16-3.58 0-5.265-2.526-5.265-5.477 0-2.952 1.685-5.478 5.056-5.478 3.37 0 5.055 2.526 5.055 5.478v.844Zm-3.16-2.107c0-.21-.21-1.686-1.895-1.686-1.686 0-1.895 1.476-1.895 1.686l.21.21h3.37l.21-.21ZM46.764 22.104c0 .422.21.632.631.632h1.895l.21.209v2.107l-.21.21h-1.895c-1.894 0-3.58-.845-3.58-3.161v-4.634l-.209-.21H42.13l-.21-.209v-2.107l.21-.21h1.476l.21-.209v-1.894l.209-.21h2.526l.21.21v1.894l.209.21h2.317l.21.21v2.106l-.21.21H46.97l-.21.21V22.1l.004.003ZM54.558 25.265h-2.526l-.21-.21V10.73l.21-.21h2.526l.21.21v14.322l-.21.21v.003ZM60.245 13.046H57.72l-.21-.209V10.73l.21-.21h2.526l.21.21v2.107l-.21.21Zm0 12.22H57.72l-.21-.21V14.944l.21-.21h2.526l.21.21v10.112l-.21.21ZM70.147 10.73v2.107l-.21.21h-1.894c-.422 0-.631.209-.631.631v.844l.21.21h2.106l.21.21v2.106l-.21.21h-2.107l-.21.21v7.581l-.209.21h-2.526l-.21-.21v-7.582l-.209-.21h-1.476l-.209-.209v-2.107l.21-.21h1.475l.21-.209v-.844c0-2.317 1.685-3.161 3.58-3.161h1.894l.21.21-.004.003ZM77.939 25.474c-.845 2.108-1.686 3.37-4.634 3.37h-1.054l-.21-.209v-2.107l.21-.21h1.054c1.054 0 1.263-.209 1.476-.84v-.21l-3.37-8.216v-2.108l.209-.21h1.894l.21.21 2.526 7.163h.21l2.526-7.163.209-.21h1.895l.21.21v2.108l-3.371 8.426.01-.004Z"
          fill="#014847"
        ></path>
        <path
          d="m160.483 18.54.209.209v2.526l-.209.21h-14.526l-.209-.21 1.05-2.526.21-.21h13.475Z"
          fill="#05BDBA"
        ></path>
      </svg>
    ),
  },
]

const plugins = [
  {
    href: '#',
    name: 'NextWP Headless Theme',
    description:
      'A NextJS theme for headless WordPress sites built with NextWP.',
    logo: logoPhp,
  },
  {
    href: '#',
    name: 'NextWP Headless Theme',
    description:
      'A NextJS theme for headless WordPress sites built with NextWP.',
    logo: logoPhp,
  },
]

export function Libraries() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="official-libraries">
        NPM Packages
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {libraries.map((library) => (
          <div key={library.name} className="flex flex-row-reverse gap-6">
            <div className="flex-auto">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {library.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {library.description}
              </p>
              <p className="mt-4">
                <Button href={library.href} variant="text" arrow="right">
                  Read more
                </Button>
              </p>
            </div>
            {library.logo ? (
              <Image
                src={library.logo}
                alt=""
                className="h-12 w-12"
                unoptimized
                width={library.logoWidth}
                height={library.logoHeight}
              />
            ) : null}
            {library.svg ? library.svg : null}
          </div>
        ))}
      </div>

      <Heading level={2} id="official-libraries">
        WordPress Themes & Plugins
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {plugins.map((plugin) => (
          <div key={plugin.name} className="flex flex-row-reverse gap-6">
            <div className="flex-auto">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {plugin.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {plugin.description}
              </p>
              <p className="mt-4">
                <Button href={plugin.href} variant="text" arrow="right">
                  Read more
                </Button>
              </p>
            </div>
            <Image src={plugin.logo} alt="" className="h-12 w-12" unoptimized />
          </div>
        ))}
      </div>
    </div>
  )
}
