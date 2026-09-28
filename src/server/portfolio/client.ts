import "server-only";

import { cache } from "react";
import type { Appearance, ChapterInput, ContentSnapshot, Post, PostInput } from "@/domain/content";

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

interface ApiErrorBody {
  code?: string;
  message?: string;
}

export class PortfolioApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "PortfolioApiError";
  }
}

function getApiUrl() {
  const value = process.env.KOTLIN_API_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:8080" : undefined);
  if (!value) throw new Error("KOTLIN_API_URL is not configured");
  return value.replace(/\/$/, "");
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${getApiUrl()}${path}`, { ...init, headers, cache: "no-store" });
  } catch {
    throw new PortfolioApiError(503, "API_UNAVAILABLE", "Kotlin API에 연결할 수 없습니다.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as ApiErrorBody;
    throw new PortfolioApiError(response.status, body.code ?? "API_ERROR", body.message ?? "API 요청에 실패했습니다.");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const getPublicSnapshot = cache(() => request<ContentSnapshot>("/api/v1/portfolio"));
const getPublishedPostBySlug = cache((slug: string) => request<Post | null>(`/api/v1/posts/${encodeURIComponent(slug)}`));

export const portfolioApi = {
  getPublicSnapshot,
  getPublishedPostBySlug,
  login: (password: string) => request<LoginResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
  verifyAdmin: (token: string) => request<{ authenticated: boolean }>("/api/v1/auth/me", {}, token),
  getAdminSnapshot: (token: string) => request<ContentSnapshot>("/api/v1/admin/content", {}, token),
  saveChapter: (token: string, input: ChapterInput) => input.id
    ? request<void>(`/api/v1/admin/chapters/${encodeURIComponent(input.id)}`, { method: "PUT", body: JSON.stringify(input) }, token)
    : request<void>("/api/v1/admin/chapters", { method: "POST", body: JSON.stringify(input) }, token),
  deleteChapter: (token: string, id: string) => request<void>(`/api/v1/admin/chapters/${encodeURIComponent(id)}`, { method: "DELETE" }, token),
  moveChapter: (token: string, id: string, direction: -1 | 1) => request<void>(`/api/v1/admin/chapters/${encodeURIComponent(id)}/move`, { method: "POST", body: JSON.stringify({ direction }) }, token),
  savePost: (token: string, input: PostInput) => input.id
    ? request<void>(`/api/v1/admin/posts/${encodeURIComponent(input.id)}`, { method: "PUT", body: JSON.stringify(input) }, token)
    : request<void>("/api/v1/admin/posts", { method: "POST", body: JSON.stringify(input) }, token),
  deletePost: (token: string, id: string) => request<void>(`/api/v1/admin/posts/${encodeURIComponent(id)}`, { method: "DELETE" }, token),
  updateAppearance: (token: string, input: Appearance) => request<void>("/api/v1/admin/appearance", { method: "PUT", body: JSON.stringify(input) }, token),
};
