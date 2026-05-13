import type { Book } from "@/app/types/books";

import { StatusPill } from "./StatusPill";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card">
      <div className="book-card-top">
        <div className="book-identity">
          <div className={`book-cover ${book.cover}`} aria-hidden="true">
            <span />
          </div>
          <div>
            <h3>{book.title}</h3>
          </div>
        </div>
        <StatusPill />
      </div>
      <dl className="book-meta">
        <div>
          <dt>Author</dt>
          <dd>{book.author}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{book.category}</dd>
        </div>
      </dl>
    </article>
  );
}
