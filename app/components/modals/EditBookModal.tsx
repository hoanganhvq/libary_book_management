"use client";

import { FormEvent, useState } from "react";

import { CategorySelect } from "@/app/components/CategorySelect";
import { Icon } from "@/app/components/Icon";
import type { Book, DraftBook } from "@/app/types/books";

export function EditBookModal({
  book,
  onClose,
  onUpdated,
}: {
  book: Book;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [draft, setDraft] = useState<DraftBook>({
    author: book.author,
    category: book.category.startsWith("Placeholder") ? "" : book.category,
    title: book.title,
  });
  const [submitProblem, setSubmitProblem] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitProblem(null);

    if (!draft.title.trim() || !draft.author.trim()) {
      setSubmitProblem("Placeholder: title and author are required by the API.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        body: JSON.stringify({
          author: draft.author.trim(),
          available: true,
          category: draft.category.trim(),
          title: draft.title.trim(),
        }),
        headers: { "content-type": "application/json" },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      onUpdated();
    } catch {
      setSubmitProblem("Placeholder: unable to update this book through the backend API.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="bulk-modal edit-modal" onSubmit={handleSubmit} aria-labelledby="edit-book-title">
        <header className="modal-header">
          <div>
            <h2 id="edit-book-title">Modify Book</h2>
            <p>Update the stored book details. Placeholder: ISBN is not available in the API.</p>
          </div>
          <button className="close-button" aria-label="Close modal" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </header>

        <div className="edit-form">
          <label>
            <span>Book Title</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              value={draft.title}
            />
          </label>
          <label>
            <span>Author</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, author: event.target.value }))}
              value={draft.author}
            />
          </label>
          <label>
            <span>Category</span>
            <CategorySelect
              ariaLabel="Category"
              onChange={(value) => setDraft((current) => ({ ...current, category: value }))}
              value={draft.category}
            />
          </label>
          {submitProblem && <p className="modal-problem">{submitProblem}</p>}
        </div>

        <footer className="modal-footer">
          <p>
            <Icon name="info" />
            Editing book #{book.id}. Placeholder: the API only supports title, author, category, and availability.
          </p>
          <div>
            <button className="text-button" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="save-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
