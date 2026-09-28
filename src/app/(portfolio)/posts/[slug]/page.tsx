import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioApiError, portfolioApi } from "@/server/portfolio/client";

async function findPost(slug: string) {
  try {
    return await portfolioApi.getPublishedPostBySlug(slug);
  } catch (error) {
    if (error instanceof PortfolioApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  return post ? { title: `${post.title} | JINSU.DEV`, description: post.summary } : {};
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, snapshot] = await Promise.all([findPost(slug), portfolioApi.getPublicSnapshot()]);
  if (!post) notFound();
  const chapter = snapshot.chapters.find((item) => item.id === post.chapterId);
  return <article className="page"><Link className="detail-back" href="/posts">← 글 목록</Link><header className="detail-header"><p className="eyebrow">{chapter?.title} · {post.updatedAt}</p><h1>{post.title}</h1><p className="detail-lead">{post.summary}</p></header><div className="detail-body"><section><p>{post.content}</p></section></div></article>;
}
