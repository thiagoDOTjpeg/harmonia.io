import { Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import { getPageMap } from "nextra/page-map";
import { SuppressConsoleWarnings } from "@/components/suppress-console-warnings";
import { HarmoniaLogo } from "@harmonia/ui";

export const metadata = {
  title: "Harmonia Docs",
};

const navbar = (
  <Navbar
    chatLink="https://discord.gg/3gYajwJuXA"
    projectLink="https://github.com/thiagoDOTjpeg/harmonia.io"
    logo={
      <div className="flex items-center gap-2.5">
        <HarmoniaLogo className="h-7 w-auto text-harmonia-lime" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground ml-1">
          Docs
        </span>
      </div>
    }
  />
);

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap("/docs");

  return (
    <>
      <SuppressConsoleWarnings />
      <Layout
        navbar={navbar}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/thiagoDOTjpeg/harmonia.io/tree/main/docs"
        sidebar={{
          defaultMenuCollapseLevel: 1,
          toggleButton: true,
        }}
        search={false}
        editLink={false}
        feedback={{ link: "", content: "", labels: "" }}
      >
        {children}
      </Layout>
    </>
  );
}
