import Link from "next/link";
import { projects } from "@/data/seed";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <div className="page"><h1 className="page-title">프로젝트를 찾을 수 없습니다.</h1></div>;
  return <article className="page"><Link className="detail-back" href="/projects">← 프로젝트 목록</Link><header className="detail-header"><p className="eyebrow">{project.period}</p><h1>{project.title}</h1><p className="detail-lead">{project.summary}</p><div className="tags">{project.stack.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></header><div className="detail-body"><section><h2>프로젝트 개요</h2><p>핵심 도메인의 정합성과 장애 복구 가능성을 우선순위로 두고 설계한 백엔드 프로젝트입니다.</p></section></div></article>;
}
