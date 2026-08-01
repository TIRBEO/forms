import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-12 w-full rounded-lg border bg-white px-4 py-2 text-base text-tirbeo-neutral-900 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tirbeo-blue-500 focus-visible:border-tirbeo-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235F6368%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10",
            error
              ? "border-tirbeo-red-500 focus-visible:ring-tirbeo-red-500"
              : "border-tirbeo-neutral-300 hover:border-tirbeo-neutral-400",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-tirbeo-red-500">{error}</p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
