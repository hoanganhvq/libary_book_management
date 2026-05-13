export function PlaceholderCard({ message }: { message: string }) {
  return (
    <article className="placeholder-card">
      <p>{message}</p>
    </article>
  );
}

export function TableMessage({ message }: { message: string }) {
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

export function SearchActivity() {
  return (
    <span className="search-activity" aria-live="polite">
      <span aria-hidden="true" />
      Searching
    </span>
  );
}

export function SearchStatus() {
  return (
    <span className="search-status" aria-live="polite">
      Updating results
    </span>
  );
}
