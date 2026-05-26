import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function BarsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function AngleRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function AngleLeftIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function AngleDownIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function BagShoppingIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.86 0-7 2.46-7 5.5V21h14v-1.5c0-3.04-3.14-5.5-7-5.5z" />
    </svg>
  );
}

export function MessageCaptionsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <path d="M7 9.5h7" />
      <path d="M7 13h5" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 8 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M1.5 6.5 6.5 1.5" />
      <path d="M2.5 1.5h4v4" />
    </svg>
  );
}

export function AccessibilityIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M6.5 8.5h11" />
      <path d="M12 8.5v5.5l3.5 6" />
      <path d="M12 14l-3.5 6" />
    </svg>
  );
}
