// Defines the Post interface used throughout the application
export interface Post {
    ID: number;
    CreatedAt: string;
    topic: string;
    title: string;
    content: string;
    author: string;
    likes: number;
}

