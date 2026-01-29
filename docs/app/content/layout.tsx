import { Footer, Layout, Navbar } from "nextra-theme-docs"
import { getPageMap } from "nextra/page-map"
import "nextra-theme-docs/style.css"
import themeConfig from "../../theme.config"

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap("/content")
  const navbar = (
    <Navbar
      logo={themeConfig.logo}
      projectLink={themeConfig.project?.link}
    />
  )
  const footer = <Footer>{themeConfig.footer.text}</Footer>
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout
          pageMap={pageMap}
          navbar={navbar}
          footer={footer}
          docsRepositoryBase={themeConfig.docsRepositoryBase}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
