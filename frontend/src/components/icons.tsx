import {
  LucideProps,
  Moon,
  Sun,
  Loader2,
  type Icon as LucideIcon,
} from "lucide-react";
import { GitHub } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  sun: Sun,
  moon: Moon,
  gitHub: GitHub,
  spinner: Loader2,
  google: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.086-9.269l4.545-2.624-4.545-2.624v1.882H5.81v1.485h5.105v1.881z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
