import { Items } from '@/components/Libraries'
import logoPhp from '@/images/logos/php.svg'

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

export function WordPressPluginsThemes() {
  return <Items items={plugins} />
}
