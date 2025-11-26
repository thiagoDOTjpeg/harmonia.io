import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import { getPageMap } from "nextra/page-map";

export const metadata = {
  title: "Harmonia Docs",
};

const navbar = <Navbar logo={<b>Harmonia Docs</b>} />;
const footer = <Footer>Harmonia.io {new Date().getFullYear()}</Footer>;

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
      docsRepositoryBase="https://github.com/seu-user/seu-repo/tree/main/docs"
      footer={footer}
      sidebar={{
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
      }}
    >
      {children}
    </Layout>
  );
}
