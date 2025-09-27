import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const icons = {
  penToSquare: faPenToSquare,
  xmark: faXmark,
} as const;

export type IconName = keyof typeof icons;
