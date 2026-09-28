"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { Chapter, Post } from "@/domain/content";
import { deletePostAction, savePostAction } from "@/app/admin/content-actions";
import { useUiStore } from "@/stores/ui-store";

export function PostManager({ posts, chapters }: { posts: Post[]; chapters: Chapter[] }) {
  const { editingPostId, editPost } = useUiStore();
  const editing = posts.find((post) => post.id === editingPostId);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (editing?.id) form.set("id", editing.id);
    startTransition(async () => {
      const result = await savePostAction(form);
      if (!result.ok) return setError(result.error ?? "저장하지 못했습니다.");
      setError(null);
      editPost(null);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!window.confirm("이 게시글을 삭제할까요?")) return;
    startTransition(async () => {
      const result = await deletePostAction(id);
      if (!result.ok) return setError(result.error ?? "삭제하지 못했습니다.");
      router.refresh();
    });
  };

  return <div className="admin-workspace"><section className="admin-panel"><div className="admin-panel-head"><div><p className="admin-kicker">CONTENT</p><h3>게시글 목록</h3></div><button className="admin-button primary" onClick={() => editPost("new")}>새 글 작성</button></div><div className="admin-list">{posts.map((post) => <article className="admin-list-row" key={post.id}><div><span className={`status-badge ${post.status.toLowerCase()}`}>{post.status === "PUBLISHED" ? "공개" : "초안"}</span><h4>{post.title}</h4><p>{chapters.find((chapter) => chapter.id === post.chapterId)?.title} · {post.updatedAt}</p></div><div className="admin-row-actions"><button onClick={() => editPost(post.id)}>수정</button><button className="danger" disabled={pending} onClick={() => remove(post.id)}>삭제</button></div></article>)}</div></section><section className="admin-panel editor-panel"><div className="admin-panel-head"><div><p className="admin-kicker">EDITOR</p><h3>{editing && editing.id !== "new" ? "게시글 수정" : "새 게시글"}</h3></div></div><form className="admin-form" key={editing?.id ?? "new"} onSubmit={submit}>{error && <p className="admin-error" role="alert">{error}</p>}<label>제목<input name="title" defaultValue={editing?.title ?? ""} required /></label><div className="admin-form-grid"><label>슬러그<input name="slug" defaultValue={editing?.slug ?? ""} placeholder="transaction-boundary" required pattern="[a-z0-9-]+" /></label><label>챕터<select name="chapterId" defaultValue={editing?.chapterId ?? chapters[0]?.id}>{chapters.map((chapter) => <option value={chapter.id} key={chapter.id}>{chapter.title}</option>)}</select></label></div><label>요약<textarea name="summary" rows={2} defaultValue={editing?.summary ?? ""} required /></label><label>본문<textarea className="content-editor" name="content" rows={12} defaultValue={editing?.content ?? ""} required /></label><div className="admin-form-footer"><select name="status" defaultValue={editing?.status ?? "DRAFT"}><option value="DRAFT">초안 저장</option><option value="PUBLISHED">공개</option></select><div><button className="admin-button" type="button" onClick={() => editPost(null)}>취소</button><button className="admin-button primary" disabled={pending || chapters.length === 0} type="submit">{pending ? "저장 중…" : "저장"}</button></div></div></form></section></div>;
}
