import { Icon } from "@/app/components/Icon";

export function ConfirmDeleteModal({
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
            <button className="text-button" onClick={onCancel} type="button">
              Cancel
            </button>
            <button className="danger-button" onClick={onConfirm} type="button">
              Remove
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
