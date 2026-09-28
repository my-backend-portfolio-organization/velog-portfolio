"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { Chapter, Post } from "@/domain/content";
import { deleteChapterAction, moveChapterAction, saveChapterAction } from "@/app/admin/content-actions";
import { useUiStore } from "@/stores/ui-store";

export function ChapterManager({ chapters, posts }: { chapters: Chapter[]; posts: Post[] }) {
  const { editingChapterId, editChapter } = useUiStore();
  const editing = chapters.find((chapter) => chapter.id === editingChapterId);
  const ordered = [...chapters].sort((a, b) => a.sortOrder - b.sortOrder);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (editing?.id) form.set("id", editing.id);
    startTransition(async () => {
      const result = await saveChapterAction(form);
      if (!result.ok) return setError(result.error ?? "저장하지 못했습니다.");
      setError(null); editChapter(null); router.refresh();
    });
  };

  const run = (action: () => Promise<{ ok: boolean; error?: string }>) => startTransition(async () => {
    const result = await action();
    if (!result.ok) return setError(result.error ?? "처리하지 못했습니다.");
    setError(null); router.refresh();
  });

  return <div className="admin-workspace"><section className="admin-panel"><div className="admin-panel-head"><div><p className="admin-kicker">STRUCTURE</p><h3>챕터 순서</h3></div><button className="admin-button primary" onClick={() => editChapter("new")}>챕터 추가</button></div><div className="admin-list">{ordered.map((chapter, index) => <article className="admin-list-row chapter-row" key={chapter.id}><div className="chapter-order">{String(index + 1).padStart(2, "0")}</div><div><h4>{chapter.title}</h4><p>{posts.filter((post) => post.chapterId === chapter.id).length}개 글 · {chapter.visible ? "노출" : "숨김"}</p></div><div className="admin-row-actions"><button disabled={pending || index === 0} onClick={() => run(() => moveChapterAction(chapter.id, -1))}>↑</button><button disabled={pending || index === ordered.length - 1} onClick={() => run(() => moveChapterAction(chapter.id, 1))}>↓</button><button onClick={() => editChapter(chapter.id)}>수정</button><button className="danger" disabled={pending} onClick={() => { if (window.confirm("챕터와 포함된 게시글을 모두 삭제할까요?")) run(() => deleteChapterAction(chapter.id)); }}>삭제</button></div></article>)}</div></section><section className="admin-panel editor-panel"><div className="admin-panel-head"><div><p className="admin-kicker">CHAPTER</p><h3>{editing && editing.id !== "new" ? "챕터 수정" : "새 챕터"}</h3></div></div><form className="admin-form" key={editing?.id ?? "new"} onSubmit={submit}>{error && <p className="admin-error" role="alert">{error}</p>}<label>이름<input name="title" defaultValue={editing?.title ?? ""} required /></label><label>슬러그<input name="slug" defaultValue={editing?.slug ?? ""} required pattern="[a-z0-9-]+" /></label><label>설명<textarea name="description" rows={4} defaultValue={editing?.description ?? ""} /></label><label className="check-field"><input type="checkbox" name="visible" defaultChecked={editing?.visible ?? true} /> 공개 사이드바에 표시</label><div className="admin-form-footer"><span /><div><button className="admin-button" type="button" onClick={() => editChapter(null)}>취소</button><button className="admin-button primary" disabled={pending} type="submit">{pending ? "저장 중…" : "저장"}</button></div></div></form></section></div>;
}
