import logoNode from '@/images/logos/node.svg'
import { Items } from '@/components/Libraries'
import logoGo from '@/images/logos/go.svg'

const cliTools = [
  {
    href: '/packages/create-nextwp-app',
    name: 'create-nextwp-app',
    description:
      'Create a new NextWP project in a single command with this cross platform CLI tool written in Go.',
    logo: logoGo,
  },
  {
    href: '/packages/cli',
    name: '@nextwp/cli',
    description: 'A cli tool for WP REST API typegen and more.',
    logo: logoGo,
  },
]

export function CliTools() {
  return <Items items={cliTools} />
}
