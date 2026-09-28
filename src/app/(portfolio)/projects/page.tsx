import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/seed";

export default function ProjectsPage() {
  return <div className="page"><p className="eyebrow">Projects · 2025—2026</p><h1 className="page-title">장애와 정합성에서 시작한<br />세 가지 시스템 이야기</h1><p className="page-intro">기능 목록보다 어떤 실패를 견뎌야 했고, 어떤 트레이드오프를 선택했으며, 결과를 어떻게 검증했는지 기록했습니다.</p><div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}</div></div>;
}
