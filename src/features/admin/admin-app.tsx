"use client";

import Link from "next/link";
import type { ContentSnapshot } from "@/domain/content";
import { useUiStore, type AdminSection } from "@/stores/ui-store";
import { AppearanceManager } from "./appearance-manager";
import { ChapterManager } from "./chapter-manager";
import { PostManager } from "./post-manager";
import { logout } from "@/app/admin/actions";

const sections: Array<{ id: AdminSection; label: string; icon: string }> = [
  { id: "posts", label: "게시글", icon: "≡" },
  { id: "chapters", label: "챕터", icon: "◇" },
  { id: "appearance", label: "UI 설정", icon: "◐" },
];

export function AdminApp({ snapshot }: { snapshot: ContentSnapshot }) {
  const { adminSection, setAdminSection } = useUiStore();
  const { posts, chapters, appearance } = snapshot;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div><span className="admin-kicker">BACKOFFICE</span><h1>Content Studio</h1></div>
        <nav>{sections.map((section) => <button className={adminSection === section.id ? "is-active" : ""} onClick={() => setAdminSection(section.id)} key={section.id}><span>{section.icon}</span>{section.label}</button>)}</nav>
        <div className="admin-sidebar-footer"><Link className="admin-public-link" href="/">포트폴리오 보기 ↗</Link><form action={logout}><button type="submit">로그아웃</button></form></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><p className="admin-kicker">관리 화면</p><h2>{sections.find((section) => section.id === adminSection)?.label}</h2></div><div className="admin-summary"><span>{posts.filter((post) => post.status === "PUBLISHED").length} 공개</span><span>{posts.filter((post) => post.status === "DRAFT").length} 초안</span><span>{chapters.length} 챕터</span></div></header>
        {adminSection === "posts" && <PostManager posts={posts} chapters={chapters} />}
        {adminSection === "chapters" && <ChapterManager chapters={chapters} posts={posts} />}
        {adminSection === "appearance" && <AppearanceManager appearance={appearance} />}
      </main>
    </div>
  );
}
