import { Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import { getPageMap } from "nextra/page-map";

export const metadata = {
  title: "Harmonia Docs",
};

const navbar = (
  <Navbar
    chatLink="https://discord.gg/3gYajwJuXA"
    projectLink="https://github.com/thiagoDOTjpeg/harmonia.io"
    logo={<b>Harmonia Docs</b>}
  />
);

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap("/docs");

  return (
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
  );
}
