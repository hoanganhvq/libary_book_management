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

type IconName =
  | "archive"
  | "arrow"
  | "book"
  | "briefcase"
  | "chart"
  | "chevronLeft"
  | "chevronRight"
  | "close"
  | "grid"
  | "help"
  | "info"
  | "logout"
  | "plus"
  | "search"
  | "trash"
  | "truck";

const paths = {
  archive: "M4 7h16M6 7v11h12V7M9 11h6",
  arrow: "M7 17 17 7M9 7h8v8",
  book: "M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 1-2-2V4Zm2 0v14",
  briefcase: "M5 8h14v10H5V8Zm4 0V6h6v2",
  chart: "M5 19V5M9 19v-7M13 19V9M17 19V7M3 19h18",
  chevronLeft: "m15 18-6-6 6-6",
  chevronRight: "m9 18 6-6-6-6",
  close: "M6 6l12 12M18 6 6 18",
  grid: "M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z",
  help: "M12 19h.01M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-.9.7-1.6 1.2-1.6 2.6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  info: "M12 17v-6M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  logout: "M13 5h-7v14h7M10 12h10M17 9l3 3-3 3",
  plus: "M12 5v14M5 12h14",
  search: "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21",
  trash: "M5 7h14M10 11v6M14 11v6M8 7l1-2h6l1 2M7 7l1 13h8l1-13",
  truck: "M3 7h11v8H3V7Zm11 3h4l3 3v2h-7v-5ZM7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
} satisfies Record<IconName, string>;

export function Icon({ color = "black", name }: { name: IconName; color?: IconColor }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" stroke={colors[color]}>
      <path d={paths[name]} />
    </svg>
  );
}
