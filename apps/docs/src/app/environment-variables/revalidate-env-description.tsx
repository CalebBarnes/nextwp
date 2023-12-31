import Link from 'next/link'

export function RevalidateEnvDescription() {
  return (
    <div>
      A secret key used to revalidate pages in Next.js content updates in WP.
      <br />
      The revalidate route is designed to work with the{' '}
      <Link
        href="https://wordpress.org/plugins/on-demand-revalidation/"
        target="_blank"
      >
        On-Demand Revalidation
      </Link>{' '}
      plugin by{' '}
      <Link href="https://gdidentity.sk/" target="_blank">
        GD IDENTITY
      </Link>
    </div>
  )
}
