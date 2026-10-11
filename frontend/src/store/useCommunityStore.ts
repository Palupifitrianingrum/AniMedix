import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CommunityPost, STARTER_POSTS } from "@/data/community";

interface CommunityState {
  posts: CommunityPost[];
  addPost: (post: Omit<CommunityPost, "id" | "time" | "comments">) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: STARTER_POSTS,
      addPost: (post) =>
        set((s) => ({
          posts: [
            { ...post, id: "post-" + Date.now(), time: "Baru saja", comments: 0 },
            ...s.posts,
          ],
        })),
    }),
    {
      name: "animedix_community_posts",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
