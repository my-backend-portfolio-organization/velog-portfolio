export type PublicationStatus = "DRAFT" | "PUBLISHED";

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  visible: boolean;
}

export interface Post {
  id: string;
  chapterId: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: PublicationStatus;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  accent: string;
  period: string;
}

export interface Appearance {
  siteTitle: string;
  ownerName: string;
  headline: string;
  introduction: string;
  accentColor: string;
  showSidebar: boolean;
}

export type ChapterInput = Omit<Chapter, "id" | "sortOrder"> & { id?: string };
export type PostInput = Omit<Post, "id" | "updatedAt"> & { id?: string };

export interface ContentSnapshot {
  appearance: Appearance;
  chapters: Chapter[];
  posts: Post[];
}
