"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Appearance, Chapter, Post } from "@/domain/content";

interface PublicShellProps {
  appearance: Appearance;
  chapters: Chapter[];
  posts: Post[];
  children: React.ReactNode;
}

export function PublicShell({ appearance, chapters, posts, children }: PublicShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("portfolio-sidebar") === "collapsed";
    const savedTheme = localStorage.getItem("portfolio-theme");
    const preferDark = matchMedia("(prefers-color-scheme: dark)").matches;
    setCollapsed(savedCollapsed);
    setDark(savedTheme ? savedTheme === "dark" : preferDark);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", collapsed || !appearance.showSidebar);
    document.body.classList.toggle("mobile-sidebar-open", mobileOpen);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.setProperty("--accent", appearance.accentColor);
    return () => {
      document.body.classList.remove("sidebar-collapsed", "mobile-sidebar-open");
    };
  }, [appearance.accentColor, appearance.showSidebar, collapsed, dark, mobileOpen]);

  const toggleSidebar = () => {
    if (matchMedia("(max-width: 820px)").matches) return setMobileOpen((value) => !value);
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("portfolio-sidebar", next ? "collapsed" : "expanded");
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("portfolio-theme", next ? "dark" : "light");
  };

  const navActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const visibleChapters = chapters.filter((chapter) => chapter.visible).sort((a, b) => a.sortOrder - b.sortOrder);
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED");

  return (
    <>
      {appearance.showSidebar && (
        <aside className="sidebar" aria-label="포트폴리오 탐색">
          <div className="sidebar-head"><span className="sidebar-label">EXPLORE</span><button className="sidebar-close" type="button" onClick={() => setMobileOpen(false)} aria-label="사이드바 닫기">×</button></div>
          <nav className="sidebar-nav">
            <Link className={`sidebar-link ${navActive("/") ? "is-active" : ""}`} href="/" onClick={() => setMobileOpen(false)}><span className="sidebar-icon">⌂</span><span className="sidebar-text">Home</span></Link>
            <Link className={`sidebar-link ${navActive("/projects") ? "is-active" : ""}`} href="/projects" onClick={() => setMobileOpen(false)}><span className="sidebar-icon">◇</span><span className="sidebar-text">Projects</span></Link>
            <Link className={`sidebar-link ${navActive("/posts") ? "is-active" : ""}`} href="/posts" onClick={() => setMobileOpen(false)}><span className="sidebar-icon">≡</span><span className="sidebar-text">Posts</span></Link>
            <div className="sidebar-children">
              {visibleChapters.flatMap((chapter) => [
                <span className="sidebar-chapter" key={`${chapter.id}-label`}>{chapter.title}</span>,
                ...publishedPosts.filter((post) => post.chapterId === chapter.id).map((post) => (
                  <Link className={`sidebar-child ${pathname === `/posts/${post.slug}` ? "is-active" : ""}`} href={`/posts/${post.slug}`} key={post.id} onClick={() => setMobileOpen(false)}>{post.title}</Link>
                )),
              ])}
            </div>
            <Link className={`sidebar-link ${navActive("/about") ? "is-active" : ""}`} href="/about" onClick={() => setMobileOpen(false)}><span className="sidebar-icon">○</span><span className="sidebar-text">About</span></Link>
          </nav>
          <div className="sidebar-foot"><span className="availability-dot" /><span className="sidebar-text">Backend Developer</span></div>
        </aside>
      )}
      <button className="sidebar-scrim" type="button" aria-label="사이드바 닫기" onClick={() => setMobileOpen(false)} />
      <header className="site-header">
        <div className="brand-row"><button className="sidebar-toggle" type="button" onClick={toggleSidebar} aria-label="사이드바 전환">☰</button><Link className="wordmark" href="/"><span className="wordmark-dot" />{appearance.siteTitle}</Link></div>
        <nav className="main-nav" aria-label="주요 메뉴"><Link className={navActive("/projects") ? "is-active" : ""} href="/projects">Projects</Link><Link className={navActive("/posts") ? "is-active" : ""} href="/posts">Posts</Link><Link className={navActive("/about") ? "is-active" : ""} href="/about">About</Link></nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={dark ? "라이트 모드 전환" : "다크 모드 전환"}>◐</button>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer"><p>© {new Date().getFullYear()} Jinsu Kim</p><p>꾸준히 배우고, 명확하게 기록합니다.</p></footer>
    </>
  );
}
