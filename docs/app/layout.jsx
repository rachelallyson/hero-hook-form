import '../app/globals.css'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'Hero Hook Form',
  description: 'Typed form helpers that combine React Hook Form and HeroUI.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}