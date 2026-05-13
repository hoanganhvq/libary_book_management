import type { Book } from "@/app/types/books";

import { Icon } from "./Icon";

export function BookTableRow({
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
          {book.isbn && <small>{book.isbn}</small>}
        </span>
      </div>
      <span>{book.author}</span>
      <span className="category-pill">{book.category}</span>
      <span className="status available">
        <i />
        In Stock
      </span>
      {/* <span>Placeholder: location unavailable</span> */}
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
