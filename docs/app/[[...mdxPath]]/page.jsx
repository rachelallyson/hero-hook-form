import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

const baseGenerateStaticParams = generateStaticParamsFor('mdxPath')

// Disable dynamic params for static generation
export const dynamicParams = false

export async function generateStaticParams() {
    return await baseGenerateStaticParams()
}

export async function generateMetadata({ params }) {
    const { mdxPath } = await params
    const { metadata } = await importPage(mdxPath)
    return metadata
}

export default async function Page({ params }) {
    const { mdxPath } = await params
    const page = await importPage(mdxPath)
    const { default: MDXContent } = page

    return <MDXContent />
}