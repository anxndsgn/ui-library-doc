import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Box, Terminal } from "lucide-react";
import { Button } from "registry/default/ui/button";
import { SITE_NAME, buildSeoMeta, ogImageUrl } from "../lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildSeoMeta({ title: SITE_NAME, image: ogImageUrl() }),
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center max-md:py-16 md:px-0">
      <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Box size={20} aria-hidden="true" />
      </div>

      <h1 className="m-0 text-[clamp(2rem,5vw,3rem)] leading-[1.1] font-semibold tracking-tight text-balance">
        Build your own UI library docs
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-pretty text-muted-foreground">
        A minimal documentation site for your UI library.Build on top of fumadocs, base-ui,
        tailwindcss and tanstack start.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          nativeButton={false}
          size={"lg"}
          render={
            <Link to="/docs/$" params={{ _splat: "components/button" }}>
              Get started
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          }
        />
        <Button
          variant={"secondary"}
          size={"lg"}
          nativeButton={false}
          render={
            <a href="https://github.com/anxndsgn" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          }
        />
      </div>

      <section className="mt-20 grid w-full grid-cols-3 divide-x-0 rounded-lg bg-muted max-md:grid-cols-1 max-md:divide-y md:divide-x">
        <Feature
          icon={<BookOpen size={16} aria-hidden="true" />}
          title="MDX Docs"
          text="Write docs in MDX with frontmatter, live previews, and code tabs."
        />
        <Feature
          icon={<Terminal size={16} aria-hidden="true" />}
          title="Registry"
          text="Generate shadcn-compatible registry JSON from your components."
        />
        <Feature
          icon={<Box size={16} aria-hidden="true" />}
          title="SSR"
          text="Server-side rendering for your documentation site with Tanstack Start."
        />
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 p-5">
      <div className="grid size-8 place-items-center text-accent-foreground">{icon}</div>
      <h2 className="m-0 text-sm font-semibold">{title}</h2>
      <p className="m-0 max-w-60 text-sm leading-6 text-pretty text-muted-foreground">{text}</p>
    </div>
  );
}
