import { PublicShell } from "@/components/public-shell";
import { portfolioApi } from "@/server/portfolio/client";

export const dynamic = "force-dynamic";

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const { appearance, chapters, posts } = await portfolioApi.getPublicSnapshot();
  return <PublicShell appearance={appearance} chapters={chapters} posts={posts}>{children}</PublicShell>;
}
