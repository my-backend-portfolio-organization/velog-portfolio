"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export function LoginForm({ showDevelopmentHint }: { showDevelopmentHint: boolean }) {
  const [state, action, pending] = useActionState(login, initialState);
  return <form className="login-card" action={action}><div><p className="admin-kicker">PRIVATE BACKOFFICE</p><h1>관리자 로그인</h1><p>게시글과 포트폴리오 UI를 관리합니다.</p></div><label>비밀번호<input name="password" type="password" autoComplete="current-password" required autoFocus /></label>{state.error && <p className="login-error" role="alert">{state.error}</p>}{showDevelopmentHint && <p className="login-hint">로컬 API의 관리자 비밀번호를 사용하세요.</p>}<button className="admin-button primary" disabled={pending} type="submit">{pending ? "확인 중…" : "로그인"}</button></form>;
}
