import { PostDirectory } from "@/features/posts/post-directory";
import { portfolioApi } from "@/server/portfolio/client";

export default async function PostsPage() {
  const { chapters, posts } = await portfolioApi.getPublicSnapshot();
  const publishedCount = posts.length;
  return <div className="page"><p className="eyebrow">Notes · {publishedCount} articles</p><h1 className="page-title">배운 것을 기록하고<br />경험을 연결합니다.</h1><p className="page-intro">서버를 운영하며 내린 기술적 결정과 장애 대응, 데이터베이스 실험을 기록합니다.</p><PostDirectory chapters={chapters} posts={posts} /></div>;
}
