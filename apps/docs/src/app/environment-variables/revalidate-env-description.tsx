import Link from 'next/link'

export function RevalidateEnvDescription() {
  return (
    <div>
      A secret key used to revalidate pages in Next.js content updates in WP.
      <br />
      The{' '}
      <Link href="/packages/nextwp/core/route-handlers#revalidate">
        revalidate route handler
      </Link>{' '}
      is designed to work with the{' '}
      <Link
        href="https://wordpress.org/plugins/on-demand-revalidation/"
        target="_blank"
      >
        On-Demand Revalidation
      </Link>{' '}
      plugin.
    </div>
  )
}
