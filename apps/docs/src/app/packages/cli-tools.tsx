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
]

export function CliTools() {
  return <Items items={cliTools} />
}
