import Link from "next/link";
import type { Project } from "@/domain/content";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link className="project-card" href={`/projects/${project.slug}`} aria-label={`${project.title} 프로젝트 자세히 보기`}>
      <div className="project-visual" style={{ "--card-color": project.accent, "--card-ink": "#17352c" } as React.CSSProperties}>
        <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="project-symbol" aria-hidden="true">↗</span>
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tags">{project.stack.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      </div>
    </Link>
  );
}
