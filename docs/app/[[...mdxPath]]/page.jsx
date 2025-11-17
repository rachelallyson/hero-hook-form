import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

const baseGenerateStaticParams = generateStaticParamsFor('mdxPath')

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
    const {
        default: MDXContent,
        toc,
        metadata,
        sourceCode
    } = await importPage(mdxPath)

    const Wrapper = getMDXComponents().wrapper

    return (
        <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
            <MDXContent />
        </Wrapper>
    )
}