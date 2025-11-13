import '../app/globals.css'
import 'nextra-theme-docs/style.css'
import '@heroui/react/styles.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Hero Hook Form',
  description: 'Typed form helpers that combine React Hook Form and HeroUI.',
}

function normalizePageMap(children) {
  return children
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <footer style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
            © {new Date().getFullYear()} Hero Hook Form
          </footer>
        </Providers>
      </body>
    </html>
  )
}

// Removed duplicate layout and conflicting imports to avoid build errors.