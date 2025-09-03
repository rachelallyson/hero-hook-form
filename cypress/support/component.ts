// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import global styles
import '../../src/index.css'

// Import React and HeroUI provider
import React from 'react'
import { HeroUIProvider } from '@heroui/system'

// Create a test wrapper component that provides necessary context
export function TestWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(HeroUIProvider, null, children)
}
