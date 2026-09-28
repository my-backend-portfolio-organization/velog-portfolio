"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { Appearance } from "@/domain/content";
import { updateAppearanceAction } from "@/app/admin/content-actions";

export function AppearanceManager({ appearance }: { appearance: Appearance }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateAppearanceAction(form);
      if (!result.ok) return setError(result.error ?? "저장하지 못했습니다.");
      setError(null); router.refresh();
    });
  };
  return <div className="admin-workspace single"><section className="admin-panel editor-panel"><div className="admin-panel-head"><div><p className="admin-kicker">APPEARANCE</p><h3>포트폴리오 UI</h3></div></div><form className="admin-form" onSubmit={submit}>{error && <p className="admin-error" role="alert">{error}</p>}<div className="admin-form-grid"><label>사이트 이름<input name="siteTitle" defaultValue={appearance.siteTitle} /></label><label>이름<input name="ownerName" defaultValue={appearance.ownerName} /></label></div><label>메인 문구<input name="headline" defaultValue={appearance.headline} /></label><label>소개<textarea name="introduction" rows={5} defaultValue={appearance.introduction} /></label><label>강조 색상<div className="color-field"><input name="accentColor" type="color" defaultValue={appearance.accentColor} /><code>{appearance.accentColor}</code></div></label><label className="check-field"><input name="showSidebar" type="checkbox" defaultChecked={appearance.showSidebar} /> 공개 화면에 사이드바 표시</label><div className="admin-form-footer"><span /><button className="admin-button primary" disabled={pending} type="submit">{pending ? "저장 중…" : "UI 저장"}</button></div></form></section><aside className="admin-preview"><p className="admin-kicker">LIVE PREVIEW</p><div className="preview-card" style={{ borderColor: appearance.accentColor }}><span style={{ color: appearance.accentColor }}>{appearance.siteTitle}</span><h3>{appearance.headline}</h3><p>{appearance.introduction}</p></div></aside></div>;
}
