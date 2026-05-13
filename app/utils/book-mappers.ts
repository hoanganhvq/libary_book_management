import type { ApiBook, Book } from "@/app/types/books";

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
