import type { ApiBook, Book, PaginatedBooksResponse } from "@/app/types/books";

const coverColors = ["blue", "ink", "sage", "navy", "gray"] as const;

export function toDisplayBook(book: ApiBook): Book {
  return {
    id: book.id,
    author: book.author,
    category: book.category?.trim() || "Placeholder: no category",
    cover: `cover-${coverColors[Math.abs(book.id) % coverColors.length]}`,
    // isbn: `Placeholder: ISBN unavailable for #${book.id}`,
    title: book.title,
  };
}

export function toPaginatedBooks(data: ApiBook[] | PaginatedBooksResponse) {
  if (Array.isArray(data)) {
    return {
      books: data,
      nextCursor: null,
      totalPages: null,
    };
  }

  const books = data.books ?? data.data ?? data.items ?? data.content ?? [];
  const totalPages = data.totalPages ?? data.totalPage ?? data.page?.totalPages ?? null;
  const totalItems = data.totalItems ?? data.totalElements ?? data.totalCount ?? data.page?.totalElements ?? null;
  const pageSize = data.pageSize ?? data.size ?? data.limit ?? data.page?.size ?? null;

  return {
    books,
    nextCursor: data.nextCursor ?? null,
    totalPages: totalPages ?? getTotalPages(totalItems, pageSize),
  };
}

function getTotalPages(totalItems?: number | null, pageSize?: number | null) {
  if (!totalItems || !pageSize) {
    return null;
  }

  return Math.max(1, Math.ceil(totalItems / pageSize));
}
