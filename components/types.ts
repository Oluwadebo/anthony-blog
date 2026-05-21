export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  dislikes: number;
  content: string;
  tags: string[];
  status: "Published" | "Draft" | "Paused";
  comments: Comment[];
  image: string;
  authorImage: string;
  lastUpdated?: string;
}

export interface Activity {
  id: string;
  type: "published" | "draft" | "subscriber" | "flagged";
  title: string;
  description: string;
  time: string;
}
