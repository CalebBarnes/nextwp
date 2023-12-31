'use client'

import { Code, CodeGroup, CodeButton } from '@/components/Code'
import { useEffect, useState } from 'react'

export function EnvCodeBlock() {
  const [code, setCode] =
    useState(`NEXT_PUBLIC_WP_URL= {#comment}https://cms.example.com{#}
WP_APPLICATION_PASSWORD=
NEXT_PREVIEW_SECRET=
REVALIDATE_SECRET_KEY=`)

  const generateCode = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const NEXT_PREVIEW_SECRET = Array(32)
      .fill(null)
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('')

    const REVALIDATE_SECRET_KEY = Array(32)
      .fill(null)
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('')

    let WP_APPLICATION_PASSWORD = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        WP_APPLICATION_PASSWORD += characters.charAt(
          Math.floor(Math.random() * characters.length),
        )
      }
      if (i < 5) WP_APPLICATION_PASSWORD += ' '
    }

    setCode(`NEXT_PUBLIC_WP_URL= {#comment}https://cms.example.com{#}
WP_APPLICATION_PASSWORD= {#comment}admin:{#} {#string}${WP_APPLICATION_PASSWORD}{#}
NEXT_PREVIEW_SECRET= {#string}${NEXT_PREVIEW_SECRET}{#}
REVALIDATE_SECRET_KEY= {#string}${REVALIDATE_SECRET_KEY}{#}`)
  }

  useEffect(() => {
    generateCode()
  }, [])
  return (
    <div>
      <CodeGroup
        title=".env.local"
        code={code}
        extraButton={
          <>
            <CodeButton
              onClick={() =>
                setCode(`NEXT_PUBLIC_WP_URL= {#comment}https://cms.example.com{#}
WP_APPLICATION_PASSWORD= 
NEXT_PREVIEW_SECRET=
REVALIDATE_SECRET_KEY=`)
              }
              clickedLabel="Cleared!"
            >
              Clear
            </CodeButton>
            <CodeButton onClick={generateCode} clickedLabel="Generated!">
              Regenerate
            </CodeButton>
          </>
        }
      >
        <Code className="language-bash">{code}</Code>
      </CodeGroup>
    </div>
  )
}
