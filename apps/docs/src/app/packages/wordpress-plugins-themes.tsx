import { Items } from '@/components/Libraries'
import logoWordPress from '@/images/logos/wordpress.svg'

const plugins = [
  {
    href: '/packages/wordpress/nextwp-headless-theme',
    name: 'NextWP Headless Theme',
    description:
      'A WordPress theme that automatically installs recommended headless plugins like NextWP Toolkit, Yoast and ACF.',
    logo: logoWordPress,
    logoPadding: '5px',
  },
  {
    href: '/packages/wordpress/nextwp-toolkit-plugin',
    name: 'NextWP Toolkit',
    description:
      'A WordPress plugin that adds NextWP specific features to your WordPress site.',
    logo: logoWordPress,
    logoPadding: '5px',
  },
]

export function WordPressPluginsThemes() {
  return <Items items={plugins} />
}
