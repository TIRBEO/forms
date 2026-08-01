import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex w-full rounded-lg border bg-white px-4 py-3 text-base text-tirbeo-neutral-900 transition-all duration-150 placeholder:text-tirbeo-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tirbeo-blue-500 focus-visible:border-tirbeo-blue-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y",
            error
              ? "border-tirbeo-red-500 focus-visible:ring-tirbeo-red-500"
              : "border-tirbeo-neutral-300 hover:border-tirbeo-neutral-400",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-tirbeo-red-500">{error}</p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
