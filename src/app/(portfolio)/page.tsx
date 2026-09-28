import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/seed";
import { portfolioApi } from "@/server/portfolio/client";

export default async function HomePage() {
  const { appearance } = await portfolioApi.getPublicSnapshot();
  return (
    <div className="page">
      <section className="hero">
        <div><p className="eyebrow">Backend Developer · Seoul</p><h1>{appearance.headline.split("단단한")[0]}<br /><span className="accent-text">단단한 시스템</span>으로.</h1><p className="hero-copy">{appearance.introduction}</p><div className="hero-actions"><Link className="button primary" href="/projects">프로젝트 보기 →</Link><Link className="button" href="/admin">Admin</Link></div></div>
        <div className="profile-mark" aria-label={`${appearance.ownerName}의 이니셜 J`}>J</div>
      </section>
      <section><div className="section-heading"><h2>Selected work</h2><Link href="/projects">모든 프로젝트 →</Link></div><div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}</div></section>
    </div>
  );
}
