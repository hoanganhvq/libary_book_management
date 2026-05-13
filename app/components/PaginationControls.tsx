import { Icon } from "./Icon";

export function PaginationControls({
  canGoNext,
  canGoPrevious,
  itemCount,
  isLoading,
  onNext,
  onPrevious,
  page,
  totalPages,
}: {
  canGoNext: boolean;
  canGoPrevious: boolean;
  itemCount: number;
  isLoading: boolean;
  onNext: () => void;
  onPrevious: () => void;
  page: number;
  totalPages: number | null;
}) {
  const pageLabel = totalPages ? `Page ${page} of ${totalPages}` : `Page ${page}`;

  return (
    <nav className="pagination-bar" aria-label="Book list pagination">
      <div className="pagination-summary">
        <strong>{pageLabel}</strong>
        <span>{itemCount} {itemCount === 1 ? "item" : "items"} on this page</span>
      </div>
      <div className="pagination-actions">
        <button disabled={!canGoPrevious || isLoading} onClick={onPrevious} type="button">
          <Icon name="chevronLeft" />
          <span>Previous</span>
        </button>
        <button disabled={!canGoNext || isLoading} onClick={onNext} type="button">
          <span>Next</span>
          <Icon name="chevronRight" />
        </button>
      </div>
    </nav>
  );
}
