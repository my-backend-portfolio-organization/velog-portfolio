"use client";

import { create } from "zustand";

export type AdminSection = "posts" | "chapters" | "appearance";

interface UiState {
  adminSection: AdminSection;
  editingPostId: string | null;
  editingChapterId: string | null;
  setAdminSection: (section: AdminSection) => void;
  editPost: (id: string | null) => void;
  editChapter: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  adminSection: "posts",
  editingPostId: null,
  editingChapterId: null,
  setAdminSection: (adminSection) => set({ adminSection }),
  editPost: (editingPostId) => set({ editingPostId }),
  editChapter: (editingChapterId) => set({ editingChapterId }),
}));
