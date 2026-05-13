export type Book = {
  id: number;
  title: string;
  isbn?: string;
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

export type PaginatedBooksResponse = {
  books?: ApiBook[];
  data?: ApiBook[];
  items?: ApiBook[];
  content?: ApiBook[];
  nextCursor?: string | null;
  count?: number | null;
  limit?: number | null;
  pageSize?: number | null;
  size?: number | null;
  totalCount?: number | null;
  totalElements?: number | null;
  totalItems?: number | null;
  totalPage?: number | null;
  totalPages?: number | null;
  page?: {
    size?: number | null;
    totalElements?: number | null;
    totalPages?: number | null;
  } | null;
};

export type DraftBook = {
  title: string;
  author: string;
  category: string;
};
