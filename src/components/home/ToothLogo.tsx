import { cn } from "@/lib/format";

export function ToothLogo({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 shadow-lg shadow-teal-600/30",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size * 0.62}
        height={size * 0.62}
        aria-hidden="true"
      >
        <path
          fill="#fff"
          d="M32 14.5c-3.4 0-5.2 1.9-8.3 1.9-4.9 0-8.2 4-8.2 9.3 0 6.6 2.5 9.5 3.8 14.6 1 4 1.6 11.3 5 11.3 3.1 0 2.4-6.9 3.9-10.6.7-1.8 1.7-3 3.8-3s3.1 1.2 3.8 3c1.5 3.7.8 10.6 3.9 10.6 3.4 0 4-7.3 5-11.3 1.3-5.1 3.8-8 3.8-14.6 0-5.3-3.3-9.3-8.2-9.3-3.1 0-4.9-1.9-8.3-1.9z"
        />
      </svg>
    </span>
  );
}
