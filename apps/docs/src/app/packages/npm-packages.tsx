// import logoNode from '@/images/logos/node.svg'
import { Items } from '@/components/Libraries'

const npmPackages = [
  {
    href: '/packages/nextwp/core',
    name: '@nextwp/core',
    description:
      'A library for Next.js for building with WordPress as Headless CMS.',
    svg: <NextLogo />,
  },
  // {
  //   href: '/packages/nextwp/addons',
  //   name: '@nextwp/addons',
  //   description: 'Additional components and features for NextWP.',
  //   svg: <NextLogo />,
  // },
  // {
  //   href: '/packages/nextwp/stackbit',
  //   name: '@nextwp/stackbit',
  //   description:
  //     'A WordPress content source interface that allows you to use the Stackbit Visual Editor with WordPress.',
  //   logo: logoNode,
  // },
]

export function NpmPackages() {
  return <Items items={npmPackages} />
}

function NextLogo() {
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
