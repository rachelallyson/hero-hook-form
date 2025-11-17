import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Providers } from './providers'
import '../app/globals.css'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'Hero Hook Form',
  description: 'Typed form helpers that combine React Hook Form and HeroUI.',
}

function normalizePageMap(pages) {
  if (!pages || !Array.isArray(pages)) return []
  return pages.map(page => {
    const normalized = {
      ...page,
      route: page.route?.replace(/^\/content/, '') || page.route,
      url: page.url?.replace(/^\/content/, '') || page.url,
    }
    // Recursively normalize children if they exist
    if (page.children) {
      normalized.children = normalizePageMap(page.children)
    }
    return normalized
  })
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()
  // Strip /content prefix from pageMap URLs since contentDirBasePath handles routing
  const normalizedPageMap = normalizePageMap(pageMap)

  const navbar = <Navbar logo={<span>Hero Hook Form</span>} />
  const footer = <Footer>© {new Date().getFullYear()} Hero Hook Form</Footer>

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Providers>
          <Layout
            navbar={navbar}
            pageMap={normalizedPageMap}
            docsRepositoryBase="https://github.com/rachelallyson/hero-hook-form/tree/main/docs/content"
            footer={footer}
          >
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}