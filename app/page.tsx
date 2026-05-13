"use client";

import { useEffect, useMemo, useState } from "react";

import { BookCard } from "@/app/components/BookCard";
import { BookTableRow } from "@/app/components/BookTableRow";
import { Icon } from "@/app/components/Icon";
import {
  PlaceholderCard,
  SearchActivity,
  SearchStatus,
  TableMessage,
} from "@/app/components/LoadingStates";
import { BulkAddBooksModal } from "@/app/components/modals/BulkAddBooksModal";
import { ConfirmDeleteModal } from "@/app/components/modals/ConfirmDeleteModal";
import { EditBookModal } from "@/app/components/modals/EditBookModal";
import type { ApiBook, Book } from "@/app/types/books";
import { toDisplayBook } from "@/app/utils/book-mappers";

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
  const recentBooks = books.slice(0, 8);
  const allSelected = books.length > 0 && selectedIds.length === books.length;
  const isSearching = isLoading && searchTerm.trim().length > 0;
  const showLargeLoadingState = isLoading && !isSearching;

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
      setApiProblem("Something went wrong! Can not delete this book due to some f");
      setDeleteIds([]);
    }
  }

  return (
    <main className="inventory-shell">
      <aside className="sidebar" aria-label="Library navigation">
        <div className="brand-block">
          <h1>Mock Project</h1>
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
            <label className={`search-field${isSearching ? " searching" : ""}`}>
              <Icon name="search" />
              <span className="sr-only">Search books</span>
              <input
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search books..."
                type="search"
                value={searchTerm}
              />
              {isSearching && <SearchActivity />}
            </label>
            <div className="avatar" aria-label="Manager profile" />
          </div>
        </header>

        <section
          aria-busy={isLoading}
          className={`inventory-columns${isLoading ? " loading" : ""}`}
          aria-label="Recent in-stock books"
        >
          <div className="status-column results-surface">
            <div className="column-label green">
              <span />
              Recently Added In Stock
            </div>
            {showLargeLoadingState && <PlaceholderCard message="Loading books from API..." />}
            {apiProblem && <PlaceholderCard message={apiProblem} />}
            {!isLoading && !apiProblem && recentBooks.length === 0 && (
              <PlaceholderCard message="Placeholder: no books returned by the API." />
            )}
            {recentBooks.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        </section>

        <section
          aria-busy={isLoading}
          className={`shipments-section${isLoading ? " loading" : ""}`}
          aria-label="Books list view"
        >
          <div className="section-heading">
            <div className="section-title">
              <h3>Book List</h3>
              {isSearching && <SearchStatus />}
            </div>
            <button
              className="danger-action"
              disabled={selectedIds.length === 0}
              onClick={() => setDeleteIds(selectedIds)}
              type="button"
            >
              Remove Selected ({selectedIds.length})
            </button>
          </div>
          <div className="shipment-table results-surface" role="table" aria-label="Books table">
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
              <span>Actions</span>
            </div>
            {showLargeLoadingState && <TableMessage message="Loading books from API..." />}
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
