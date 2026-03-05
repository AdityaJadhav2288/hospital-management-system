import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "danger";
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "default" && "bg-muted text-foreground",
        tone === "success" && "bg-success/20 text-success",
        tone === "warning" && "bg-warning/20 text-warning",
        tone === "danger" && "bg-danger/20 text-danger",
        className,
      )}
      {...props}
    />
  );
}
