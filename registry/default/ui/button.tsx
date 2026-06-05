import * as React from "react";

const variants = {
  default:
    "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-emerald-700 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300 dark:focus-visible:outline-emerald-400",
  secondary:
    "bg-stone-100 text-stone-950 hover:bg-stone-200 focus-visible:outline-stone-500 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-700 dark:focus-visible:outline-stone-400",
  quiet:
    "bg-transparent text-stone-700 hover:bg-stone-100 focus-visible:outline-stone-500 dark:text-stone-300 dark:hover:bg-stone-800 dark:focus-visible:outline-stone-400",
} as const;

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
} as const;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md font-medium outline-none transition-colors active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
