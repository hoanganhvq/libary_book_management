"use client";

import { FormEvent, useState } from "react";

import { CategorySelect } from "@/app/components/CategorySelect";
import { Icon } from "@/app/components/Icon";
import type { DraftBook } from "@/app/types/books";

export function BulkAddBooksModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [rows, setRows] = useState<DraftBook[]>([
    {
      title: "Echoes of the Past",
      author: "Elena Vance",
      category: "Historical Fiction",
    },
    {
      title: "",
      author: "",
      category: "",
    },
  ]);
  const [submitProblem, setSubmitProblem] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);

  function updateRow(index: number, key: keyof DraftBook, value: string) {
    setRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    );
  }

  function addRow() {
    setRows((current) => [...current, { title: "", author: "", category: "" }]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitProblem(null);

    const validRows = rows.filter((row) => row.title.trim() && row.author.trim());
    if (validRows.length === 0) {
      setSubmitProblem("Placeholder: title and author are required by the API.");
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        validRows.map(async (row) => {
          const response = await fetch("/api/books", {
            body: JSON.stringify({
              author: row.author.trim(),
              available: true,
              category: row.category.trim(),
              title: row.title.trim(),
            }),
            headers: { "content-type": "application/json" },
            method: "POST",
          });

          if (!response.ok) {
            throw new Error(`API responded with ${response.status}`);
          }
        }),
      );

      onCreated();
    } catch {
      setSubmitProblem("Placeholder: unable to save books through the backend API.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="bulk-modal" onSubmit={handleSubmit} aria-labelledby="bulk-add-title">
        <header className="modal-header">
          <div>
            <h2 id="bulk-add-title">Add Books</h2>
            <p>Fill in the details below to add multiple titles to your library inventory simultaneously.</p>
          </div>
          <button className="close-button" aria-label="Close modal" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </header>

        <div className="modal-table-wrap">
          <div className="bulk-table">
            <div className="bulk-row bulk-head">
              <span>Book Title</span>
              <span>Author</span>
              <span>Category</span>
              <span>Remove</span>
            </div>
            {rows.map((row, index) => (
              <div className="bulk-row" key={index}>
                <input
                  aria-label={`Book title row ${index + 1}`}
                  onChange={(event) => updateRow(index, "title", event.target.value)}
                  placeholder="e.g. The Silent Forest"
                  value={row.title}
                />
                <input
                  aria-label={`Author row ${index + 1}`}
                  onChange={(event) => updateRow(index, "author", event.target.value)}
                  placeholder="Author Name"
                  value={row.author}
                />
                <CategorySelect
                  ariaLabel={`Category row ${index + 1}`}
                  onChange={(value) => updateRow(index, "category", value)}
                  value={row.category}
                />
                <button
                  className="row-remove"
                  disabled={rows.length === 1}
                  onClick={() => removeRow(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button className="add-row-button" onClick={addRow} type="button">
            <Icon name="plus" />
            Add Another Row
          </button>
          {submitProblem && <p className="modal-problem">{submitProblem}</p>}
        </div>

        <footer className="modal-footer">
          <p>
            <Icon name="info" />
            You are adding {rows.length} books to the main inventory. Placeholder: the API does not accept ISBNs.
          </p>
          <div>
            <button className="text-button" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="save-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save All Books"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
