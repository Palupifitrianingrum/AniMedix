/* Data contoh forum komunitas (Komunitas.png). */

export interface CommunityPost {
  id: string;
  authorInitials: string;
  authorName: string;
  text: string;
  time: string;
  tag: string;
  comments: number;
}

export const COMMUNITY_TAGS = [
  "#KesehatanTernak",
  "#PakanFermentasi",
  "#Vaksinasi",
  "#PeternakanModern",
];

export const STARTER_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorInitials: "AN",
    authorName: "Pak Arif Nugroho",
    text: "Bagaimana cara meningkatkan nafsu makan kambing setelah perjalanan jauh?",
    time: "2 jam lalu",
    tag: COMMUNITY_TAGS[0],
    comments: 12,
  },
  {
    id: "post-2",
    authorInitials: "SN",
    authorName: "Siti Nurhaliza",
    text: "Ada rekomendasi komposisi pakan fermentasi untuk sapi perah?",
    time: "4 jam lalu",
    tag: COMMUNITY_TAGS[1],
    comments: 8,
  },
  {
    id: "post-3",
    authorInitials: "BS",
    authorName: "Budi Santoso",
    text: "Jadwal vaksinasi apa saja yang sebaiknya rutin dilakukan?",
    time: "6 jam lalu",
    tag: COMMUNITY_TAGS[2],
    comments: 5,
  },
];
