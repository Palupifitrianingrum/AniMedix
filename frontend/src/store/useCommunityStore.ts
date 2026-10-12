import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CommunityComment,
  CommunityPost,
  CommentRole,
  STARTER_COMMENTS,
  STARTER_POSTS,
} from "@/data/community";

interface CommunityState {
  posts: CommunityPost[];
  /** id diskusi -> komentar (urut terlama ke terbaru) */
  comments: Record<string, CommunityComment[]>;
  addPost: (post: Omit<CommunityPost, "id" | "time">) => string;
  addComment: (
    postId: string,
    comment: { authorInitials: string; authorName: string; text: string; role?: CommentRole }
  ) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: STARTER_POSTS,
      comments: STARTER_COMMENTS,
      addPost: (post) => {
        const id = "post-" + Date.now();
        set((s) => ({
          posts: [{ ...post, id, time: "Baru saja" }, ...s.posts],
          comments: { ...s.comments, [id]: [] },
        }));
        return id;
      },
      addComment: (postId, { role = "Peternak", ...comment }) =>
        set((s) => ({
          comments: {
            ...s.comments,
            [postId]: [
              ...(s.comments[postId] ?? []),
              { ...comment, role, id: `c-${postId}-${Date.now()}`, time: "Baru saja" },
            ],
          },
        })),
    }),
    {
      name: "animedix_community_posts",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v1 menyimpan jumlah komentar sebagai angka. Postingan lama dipertahankan,
      // komentar diganti dengan data awal yang baru.
      migrate: (persisted) => {
        const old = (persisted ?? {}) as { posts?: (CommunityPost & { comments?: number })[] };
        const posts = (old.posts ?? STARTER_POSTS).map((p) => {
          const copy: Record<string, unknown> = { ...p };
          delete copy.comments;
          return copy as unknown as CommunityPost;
        });
        const missing = STARTER_POSTS.filter((sp) => !posts.some((p) => p.id === sp.id));
        return { posts: [...posts, ...missing], comments: STARTER_COMMENTS } as CommunityState;
      },
    }
  )
);
