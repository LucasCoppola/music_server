import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(durationInSeconds: number) {
  if (isNaN(durationInSeconds) || durationInSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${minutes}:${formattedSeconds}`;
}

export function highlightText(text: string, query: string | undefined) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-sky-300 text-black">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function getCoverTrackImage(image_name: string | null): string {
  if (image_name) {
    return `${import.meta.env.VITE_BASE_URL}/images/${image_name}`;
  } else {
    return `${import.meta.env.VITE_BASE_URL}/images/default_cover_track_image.png`;
  }
}
