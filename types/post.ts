export interface Comment {
  id: string;
  body: string;
}

export interface Post {
  id: string;
  title: string;
  comments: Comment[];
}
