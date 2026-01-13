import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

const themeComponents = getThemeComponents()

/**
 * Custom MDX components for better documentation presentation
 */
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
    // Add custom components for better code example presentation
    // These can be used in MDX files with <Tip>, <Warning>, <Info>, etc.
    Tip: ({ children, title = "💡 Tip" }) => (
      <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
        <div className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{title}</div>
        <div className="text-blue-800 dark:text-blue-300">{children}</div>
      </div>
    ),
    Warning: ({ children, title = "⚠️ Warning" }) => (
      <div className="my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r">
        <div className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">{title}</div>
        <div className="text-yellow-800 dark:text-yellow-300">{children}</div>
      </div>
    ),
    Info: ({ children, title = "ℹ️ Info" }) => (
      <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r">
        <div className="font-semibold text-gray-900 dark:text-gray-200 mb-2">{title}</div>
        <div className="text-gray-800 dark:text-gray-300">{children}</div>
      </div>
    ),
    Note: ({ children, title = "📝 Note" }) => (
      <div className="my-6 p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r">
        <div className="font-semibold text-purple-900 dark:text-purple-200 mb-2">{title}</div>
        <div className="text-purple-800 dark:text-purple-300">{children}</div>
      </div>
    ),
  }
}