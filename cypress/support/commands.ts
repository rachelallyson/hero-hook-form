import { mount } from 'cypress/react'

// Make mount available globally for convenience
// @ts-expect-error attach to global for tests
window.mount = mount
