"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminToken } from "@/server/auth/session";
import { PortfolioApiError, portfolioApi } from "@/server/portfolio/client";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const slug = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const chapterSchema = z.object({
  id: z.string().uuid().or(z.string().startsWith("chapter-")).optional(),
  title: z.string().trim().min(1).max(80),
  slug,
  description: z.string().trim().max(240),
  visible: z.boolean(),
});
const postSchema = z.object({
  id: z.string().uuid().or(z.string().startsWith("post-")).optional(),
  chapterId: z.string().min(1),
  title: z.string().trim().min(2).max(160),
  slug,
  summary: z.string().trim().min(2).max(320),
  content: z.string().trim().min(2).max(100_000),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
const appearanceSchema = z.object({
  siteTitle: z.string().trim().min(1).max(40),
  ownerName: z.string().trim().min(1).max(40),
  headline: z.string().trim().min(2).max(120),
  introduction: z.string().trim().min(2).max(500),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  showSidebar: z.boolean(),
});

function refreshContent() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

function failure(error: unknown): ActionResult {
  if (error instanceof z.ZodError) return { ok: false, error: "입력값을 다시 확인해주세요." };
  if (error instanceof Error && error.message === "Unauthorized") return { ok: false, error: "로그인이 만료되었습니다." };
  if (error instanceof PortfolioApiError && error.status === 409) return { ok: false, error: "이미 사용 중인 슬러그이거나 순서가 충돌했습니다." };
  if (error instanceof PortfolioApiError && error.status === 401) return { ok: false, error: "로그인이 만료되었습니다." };
  console.error(error);
  return { ok: false, error: "저장 중 문제가 발생했습니다." };
}

export async function saveChapterAction(formData: FormData): Promise<ActionResult> {
  try {
    const token = await requireAdminToken();
    const input = chapterSchema.parse({ id: formData.get("id") || undefined, title: formData.get("title"), slug: formData.get("slug"), description: formData.get("description") ?? "", visible: formData.get("visible") === "on" });
    await portfolioApi.saveChapter(token, input);
    refreshContent();
    return { ok: true };
  } catch (error) { return failure(error); }
}

export async function deleteChapterAction(id: string): Promise<ActionResult> {
  try { const token = await requireAdminToken(); await portfolioApi.deleteChapter(token, id); refreshContent(); return { ok: true }; }
  catch (error) { return failure(error); }
}

export async function moveChapterAction(id: string, direction: -1 | 1): Promise<ActionResult> {
  try { const token = await requireAdminToken(); await portfolioApi.moveChapter(token, id, direction); refreshContent(); return { ok: true }; }
  catch (error) { return failure(error); }
}

export async function savePostAction(formData: FormData): Promise<ActionResult> {
  try {
    const token = await requireAdminToken();
    const input = postSchema.parse({ id: formData.get("id") || undefined, chapterId: formData.get("chapterId"), title: formData.get("title"), slug: formData.get("slug"), summary: formData.get("summary"), content: formData.get("content"), status: formData.get("status") });
    await portfolioApi.savePost(token, input);
    refreshContent();
    return { ok: true };
  } catch (error) { return failure(error); }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  try { const token = await requireAdminToken(); await portfolioApi.deletePost(token, id); refreshContent(); return { ok: true }; }
  catch (error) { return failure(error); }
}

export async function updateAppearanceAction(formData: FormData): Promise<ActionResult> {
  try {
    const token = await requireAdminToken();
    const input = appearanceSchema.parse({ siteTitle: formData.get("siteTitle"), ownerName: formData.get("ownerName"), headline: formData.get("headline"), introduction: formData.get("introduction"), accentColor: formData.get("accentColor"), showSidebar: formData.get("showSidebar") === "on" });
    await portfolioApi.updateAppearance(token, input);
    refreshContent();
    return { ok: true };
  } catch (error) { return failure(error); }
}
