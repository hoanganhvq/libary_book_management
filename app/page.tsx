"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Book = {
  id: number;
  title: string;
  isbn: string;
  author: string;
  category: string;
  cover: string;
};

type ApiBook = {
  id: number;
  title: string;
  author: string;
  category?: string | null;
  available?: boolean | null;
};

type DraftBook = {
  title: string;
  author: string;
  category: string;
};

export default function InventoryPage() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [apiBooks, setApiBooks] = useState<ApiBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [apiProblem, setApiProblem] = useState<string | null>(null);

  async function loadBooks(title = searchTerm) {
    setLoading(true);
    setApiProblem(null);

    try {
      const url = title.trim()
        ? `/api/books/search?title=${encodeURIComponent(title.trim())}`
        : "/api/books";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data = (await response.json()) as ApiBook[];
      setApiBooks(Array.isArray(data) ? data : []);
      setSelectedIds([]);
    } catch {
      setApiProblem("Placeholder: unable to load books from the backend API.");
      setApiBooks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBooks(searchTerm);
    }, 250);

    return () => window.clearTimeout(timer);
    // loadBooks intentionally reads latest state; searchTerm is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const books = useMemo(
    () => apiBooks.map(toDisplayBook).sort((a, b) => b.id - a.id),
    [apiBooks],
  );
  const recentBooks = books.slice(0, 6);
  const allSelected = books.length > 0 && selectedIds.length === books.length;

  function handleCreated() {
    setSearchTerm("");
    setAddModalOpen(false);
    void loadBooks("");
  }

  function handleUpdated() {
    setEditingBook(null);
    void loadBooks();
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  }

  function toggleAllSelected() {
    setSelectedIds(allSelected ? [] : books.map((book) => book.id));
  }

  async function confirmDelete() {
    try {
      await Promise.all(
        deleteIds.map(async (id) => {
          const response = await fetch(`/api/books/${id}`, { method: "DELETE" });

          if (!response.ok) {
            throw new Error(`API responded with ${response.status}`);
          }
        }),
      );

      setDeleteIds([]);
      setSelectedIds([]);
      void loadBooks();
    } catch {
      setApiProblem("Placeholder: unable to remove selected books through the backend API.");
      setDeleteIds([]);
    }
  }

  return (
    <main className="inventory-shell">
      <aside className="sidebar" aria-label="Library navigation">
        <div className="brand-block">
          <h1>Lumina</h1>
          <p>Central Branch Library</p>
        </div>

        <nav className="nav-list">
          <a className="nav-item active" href="#">
            <Icon name="book" />
            <span>Library</span>
          </a>
          <button className="primary-wide" onClick={() => setAddModalOpen(true)} type="button">
            Bulk Import Books
          </button>
        </nav>
      </aside>

      <section className="workspace" aria-label="Inventory list view">
        <header className="topbar">
          <div>
            <h2>Inventory</h2>
            <p>Manage your literary collection and stock levels.</p>
          </div>
          <div className="topbar-actions">
            <label className="search-field">
              <Icon name="search" />
              <span className="sr-only">Search books</span>
              <input
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search books..."
                type="search"
                value={searchTerm}
              />
            </label>
            <div className="avatar" aria-label="Manager profile" />
          </div>
        </header>

        <section className="inventory-columns" aria-label="Recent in-stock books">
          <div className="status-column">
            <div className="column-label green">
              <span />
              Recently Added In Stock
            </div>
            {isLoading && <PlaceholderCard message="Loading books from API..." />}
            {apiProblem && <PlaceholderCard message={apiProblem} />}
            {!isLoading && !apiProblem && recentBooks.length === 0 && (
              <PlaceholderCard message="Placeholder: no books returned by the API." />
            )}
            {recentBooks.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        </section>

        <section className="shipments-section" aria-label="Books list view">
          <div className="section-heading">
            <h3>Book List</h3>
            <button
              className="danger-action"
              disabled={selectedIds.length === 0}
              onClick={() => setDeleteIds(selectedIds)}
              type="button"
            >
              Remove Selected ({selectedIds.length})
            </button>
          </div>
          <div className="shipment-table" role="table" aria-label="Books table">
            <div className="shipment-row shipment-head" role="row">
              <label className="table-check">
                <input
                  checked={allSelected}
                  disabled={books.length === 0}
                  onChange={toggleAllSelected}
                  type="checkbox"
                />
                <span className="sr-only">Select all books</span>
              </label>
              <span>Book Detail</span>
              <span>Author</span>
              <span>Category</span>
              <span>Status</span>
              <span>Location</span>
              <span>Actions</span>
            </div>
            {isLoading && <TableMessage message="Loading books from API..." />}
            {apiProblem && <TableMessage message={apiProblem} />}
            {!isLoading && !apiProblem && books.length === 0 && (
              <TableMessage message="Placeholder: no books returned by the API." />
            )}
            {books.map((book) => (
              <BookTableRow
                book={book}
                isSelected={selectedIds.includes(book.id)}
                key={book.id}
                onDelete={() => setDeleteIds([book.id])}
                onEdit={() => setEditingBook(book)}
                onSelectedChange={() => toggleSelected(book.id)}
              />
            ))}
          </div>
        </section>
      </section>

      {isAddModalOpen && <BulkAddBooksModal onClose={() => setAddModalOpen(false)} onCreated={handleCreated} />}
      {editingBook && (
        <EditBookModal book={editingBook} onClose={() => setEditingBook(null)} onUpdated={handleUpdated} />
      )}
      {deleteIds.length > 0 && (
        <ConfirmDeleteModal
          count={deleteIds.length}
          onCancel={() => setDeleteIds([])}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card">
      <div className="book-card-top">
        <div className="book-identity">
          <div className={`book-cover ${book.cover}`} aria-hidden="true">
            <span />
          </div>
          <div>
            <h3>{book.title}</h3>
            <p>{book.isbn}</p>
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

function BookTableRow({
  book,
  isSelected,
  onDelete,
  onEdit,
  onSelectedChange,
}: {
  book: Book;
  isSelected: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onSelectedChange: () => void;
}) {
  return (
    <div className="shipment-row" role="row">
      <label className="table-check">
        <input checked={isSelected} onChange={onSelectedChange} type="checkbox" />
        <span className="sr-only">Select {book.title}</span>
      </label>
      <div className="book-detail">
        <Icon name="book" />
        <span>
          <strong>{book.title}</strong>
          <small>{book.isbn}</small>
        </span>
      </div>
      <span>{book.author}</span>
      <span className="category-pill">{book.category}</span>
      <span className="status available">
        <i />
        In Stock
      </span>
      <span>Placeholder: location unavailable</span>
      <span className="table-actions">
        <button className="table-action" onClick={onEdit} type="button">
          Modify
        </button>
        <button className="table-action danger" onClick={onDelete} type="button">
          Remove
        </button>
      </span>
    </div>
  );
}

function PlaceholderCard({ message }: { message: string }) {
  return (
    <article className="placeholder-card">
      <p>{message}</p>
    </article>
  );
}

function TableMessage({ message }: { message: string }) {
  return (
    <div className="shipment-row table-message" role="row">
      <span>{message}</span>
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function StatusPill() {
  return (
    <span className="book-status stock">
      <i />
      In Stock
    </span>
  );
}

function toDisplayBook(book: ApiBook): Book {
  return {
    id: book.id,
    author: book.author,
    category: book.category?.trim() || "Placeholder: no category",
    cover: `cover-${["blue", "ink", "sage", "navy", "gray"][Math.abs(book.id) % 5]}`,
    isbn: `Placeholder: ISBN unavailable for #${book.id}`,
    title: book.title,
  };
}

function BulkAddBooksModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
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
            <h2 id="bulk-add-title">Bulk Add Books</h2>
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
            <button className="text-button" onClick={onClose} type="button">Cancel</button>
            <button className="save-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save All Books"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function EditBookModal({
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
            <button className="text-button" onClick={onClose} type="button">Cancel</button>
            <button className="save-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function ConfirmDeleteModal({
  count,
  onCancel,
  onConfirm,
}: {
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="confirm-modal" aria-labelledby="confirm-delete-title" role="dialog">
        <header className="modal-header">
          <div>
            <h2 id="confirm-delete-title">Remove Books</h2>
            <p>This action will remove {count} selected {count === 1 ? "book" : "books"} from inventory.</p>
          </div>
          <button className="close-button" aria-label="Close modal" onClick={onCancel} type="button">
            <Icon name="close" />
          </button>
        </header>
        <footer className="modal-footer">
          <p>
            <Icon name="info" />
            Confirm removal to avoid deleting books by mistake.
          </p>
          <div>
            <button className="text-button" onClick={onCancel} type="button">Cancel</button>
            <button className="danger-button" onClick={onConfirm} type="button">Remove</button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function CategorySelect({
  ariaLabel,
  onChange,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <select aria-label={ariaLabel} onChange={(event) => onChange(event.target.value)} value={value}>
      <option value="">Select Category</option>
      <option>Historical Fiction</option>
      <option>Fiction</option>
      <option>Biography</option>
      <option>Philosophy</option>
      <option>History</option>
    </select>
  );
}

type IconColor = "red" | "green" | "blue" | "gray" | "black" | "yellow" | "white";

const colors: Record<IconColor, string> = {
  black: "#111827",
  blue: "#3b82f6",
  gray: "#6b7280",
  green: "#22c55e",
  red: "#ba1a1a",
  white: "#ffffff",
  yellow: "#facc15",
};

function Icon({
  color = "black",
  name,
}: {
  name:
    | "archive"
    | "arrow"
    | "book"
    | "briefcase"
    | "chart"
    | "close"
    | "grid"
    | "help"
    | "info"
    | "logout"
    | "plus"
    | "search"
    | "trash"
    | "truck";
  color?: IconColor;
}) {
  const paths = {
    archive: "M4 7h16M6 7v11h12V7M9 11h6",
    arrow: "M7 17 17 7M9 7h8v8",
    book: "M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 1-2-2V4Zm2 0v14",
    briefcase: "M5 8h14v10H5V8Zm4 0V6h6v2",
    chart: "M5 19V5M9 19v-7M13 19V9M17 19V7M3 19h18",
    close: "M6 6l12 12M18 6 6 18",
    grid: "M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z",
    help: "M12 19h.01M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-.9.7-1.6 1.2-1.6 2.6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    info: "M12 17v-6M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    logout: "M13 5h-7v14h7M10 12h10M17 9l3 3-3 3",
    plus: "M12 5v14M5 12h14",
    search: "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21",
    trash: "M5 7h14M10 11v6M14 11v6M8 7l1-2h6l1 2M7 7l1 13h8l1-13",
    truck: "M3 7h11v8H3V7Zm11 3h4l3 3v2h-7v-5ZM7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  } satisfies Record<string, string>;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" stroke={colors[color]}>
      <path d={paths[name]} />
    </svg>
  );
}
