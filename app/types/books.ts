export type Book = {
  id: number;
  title: string;
  isbn: string;
  author: string;
  category: string;
  cover: string;
};

export type ApiBook = {
  id: number;
  title: string;
  author: string;
  category?: string | null;
  available?: boolean | null;
};

export type DraftBook = {
  title: string;
  author: string;
  category: string;
};
