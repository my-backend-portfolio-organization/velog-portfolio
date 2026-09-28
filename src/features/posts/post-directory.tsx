"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Chapter, Post } from "@/domain/content";

export function PostDirectory({ chapters, posts }: { chapters: Chapter[]; posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [chapterId, setChapterId] = useState("ALL");
  const visible = useMemo(() => posts.filter((post) => post.status === "PUBLISHED" && (chapterId === "ALL" || post.chapterId === chapterId) && `${post.title} ${post.summary}`.toLowerCase().includes(query.toLowerCase())), [chapterId, posts, query]);

  return <><div className="post-tools"><input className="search-box" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목과 내용으로 검색" aria-label="기술 글 검색" /></div><div className="filter-row"><button className={`filter-button ${chapterId === "ALL" ? "is-active" : ""}`} onClick={() => setChapterId("ALL")}>All</button>{chapters.filter((chapter) => chapter.visible).map((chapter) => <button className={`filter-button ${chapterId === chapter.id ? "is-active" : ""}`} onClick={() => setChapterId(chapter.id)} key={chapter.id}>{chapter.title}</button>)}</div><div className="post-list">{visible.map((post) => <Link className="post-item" href={`/posts/${post.slug}`} key={post.id}><time className="post-date">{post.updatedAt}</time><div><h3>{post.title}</h3><p>{post.summary}</p></div><span className="post-arrow">↗</span></Link>)}{visible.length === 0 && <div className="empty-state">조건에 맞는 글이 없습니다.</div>}</div></>;
}
