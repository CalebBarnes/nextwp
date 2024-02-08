import fs from 'fs'

export const GET = () => {
  const installScript = fs.readFileSync(
    '../../packages/cli/installer.sh',
    'utf8',
  )
  return new Response(installScript, { status: 200 })
}
