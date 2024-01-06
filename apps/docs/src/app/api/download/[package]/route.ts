interface User {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

interface Asset {
  url: string
  id: number
  node_id: string
  name: string
  label: string
  uploader: User
  content_type: string
  state: string
  size: number
  download_count: number
  created_at: string
  updated_at: string
  browser_download_url: string
}

interface Release {
  url: string
  assets_url: string
  upload_url: string
  html_url: string
  id: number
  author: User
  node_id: string
  tag_name: string
  target_commitish: string
  name: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
  assets: Asset[]
  tarball_url: string
  zipball_url: string
  body: string
}

const fetchOptions = {
  headers: {
    accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_PAT}`,
  },
}

export async function GET(
  _request: Request,
  { params: { package: packageName } }: { params: { package: string } },
) {
  if (!packageName) {
    return new Response('No package name provided', { status: 400 })
  }

  const releasesRes = await fetch(
    `https://api.github.com/repos/CalebBarnes/nextwp/releases`,
    fetchOptions,
  )
  const releases = (await releasesRes.json()) as Release[]

  if (!releases?.length) {
    return new Response('No releases found', { status: 404 })
  }
  const newestRelease = releases?.[0]

  const assetsRes = await fetch(
    `https://api.github.com/repos/CalebBarnes/nextwp/releases/${newestRelease.id}/assets`,
    fetchOptions,
  )
  const assets = (await assetsRes.json()) as Asset[]

  if (!assets?.length) {
    return new Response('No assets found', { status: 404 })
  }

  const matchingAsset = assets.find(
    (asset: Asset) => asset?.name?.startsWith?.(packageName),
  )

  if (!matchingAsset) {
    return new Response('No matching asset found for this packageName', {
      status: 404,
    })
  }

  return Response.redirect(matchingAsset.browser_download_url, 302)
}
