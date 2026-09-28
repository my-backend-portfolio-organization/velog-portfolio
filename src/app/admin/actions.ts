"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin, deleteAdminSession } from "@/server/auth/session";
import { PortfolioApiError } from "@/server/portfolio/client";

export interface LoginState {
  error?: string;
}

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  try {
    await authenticateAdmin(password);
  } catch (error) {
    if (error instanceof PortfolioApiError && error.status === 401) return { error: "비밀번호가 올바르지 않습니다." };
    return { error: "로그인 서버에 연결할 수 없습니다." };
  }
  redirect("/admin");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}
