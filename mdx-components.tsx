import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="mt-4 font-mono text-2xl font-semibold tracking-tight text-chalk" {...props} />
    ),
    h2: (props) => (
      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk" {...props} />
    ),
    h3: (props) => <h3 className="mt-8 text-[15px] font-semibold text-chalk" {...props} />,
    p: (props) => <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-smoke" {...props} />,
    ul: (props) => (
      <ul className="mt-4 max-w-prose list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-smoke" {...props} />
    ),
    ol: (props) => (
      <ol className="mt-4 max-w-prose list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-smoke" {...props} />
    ),
    li: (props) => <li {...props} />,
    strong: (props) => <strong className="font-semibold text-chalk" {...props} />,
    em: (props) => <em {...props} />,
    a: (props) => <a className="text-pit hover:underline" {...props} />,
    blockquote: (props) => (
      <blockquote className="mt-4 border-l-2 border-line pl-4 text-[15px] italic text-smoke" {...props} />
    ),
    code: (props) => (
      <code className="rounded bg-asphalt px-1.5 py-0.5 font-mono text-[13px] text-chalk" {...props} />
    ),
    pre: (props) => (
      <pre
        className="mt-4 overflow-x-auto rounded-xl border border-line bg-asphalt p-4 font-mono text-[13px] leading-relaxed text-smoke [&>code]:bg-transparent [&>code]:p-0"
        {...props}
      />
    ),
    hr: () => <hr className="mt-12 border-line" />,
    ...components,
  };
}
