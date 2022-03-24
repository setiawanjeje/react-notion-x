import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import { NotionRenderer } from 'react-notion-x'
import { Image, PageLink } from 'react-notion-x/third-party/next'
import { ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'
import { Tweet, TwitterContextProvider } from 'react-static-tweets'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Collection = dynamic(() =>
  import('react-notion-x/third-party/collection').then((m) => m.Collection)
)
const Code = dynamic(() =>
  import('react-notion-x/third-party/code').then((m) => m.Code)
)
const Equation = dynamic(() =>
  import('react-notion-x/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () => import('react-notion-x/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
)

export const NotionPage = ({
  recordMap,
  previewImagesEnabled,
  rootPageId,
  rootDomain
}: {
  recordMap: ExtendedRecordMap
  previewImagesEnabled?: boolean
  rootPageId?: string
  rootDomain?: string
}) => {
  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)
  console.log(title, recordMap)

  // useful for debugging from the dev console
  if (typeof window !== 'undefined') {
    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]]?.value
    const g = window as any
    g.recordMap = recordMap
    g.block = block
  }

  const socialDescription = 'React Notion X Demo'
  const socialImage =
    'https://react-notion-x-demo.transitivebullsh.it/social.jpg'

  return (
    <TwitterContextProvider
      value={{
        tweetAstMap: (recordMap as any).tweetAstMap || {},
        swrOptions: {
          fetcher: (id: string) =>
            fetch(`/api/get-tweet-ast/${id}`).then((r) => r.json())
        }
      }}
    >
      <Head>
        {socialDescription && (
          <>
            <meta name='description' content={socialDescription} />
            <meta property='og:description' content={socialDescription} />
            <meta name='twitter:description' content={socialDescription} />
          </>
        )}

        {socialImage ? (
          <>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={socialImage} />
            <meta property='og:image' content={socialImage} />
          </>
        ) : (
          <meta name='twitter:card' content='summary' />
        )}

        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:creator' content='@transitive_bs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootDomain={rootDomain}
        rootPageId={rootPageId}
        previewImages={previewImagesEnabled}
        components={{
          // NOTE: custom images will only take effect if previewImages is true and
          // if the image has a valid preview image defined in recordMap.preview_images[src]
          Image,
          PageLink,
          Code,
          Collection,
          Equation,
          Pdf,
          Modal,
          Tweet
        }}
      />
    </TwitterContextProvider>
  )
}
