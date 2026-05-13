import { bookCategories } from "@/app/utils/categories";

export function CategorySelect({
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
      {bookCategories.map((category) => (
        <option key={category}>{category}</option>
      ))}
    </select>
  );
}
