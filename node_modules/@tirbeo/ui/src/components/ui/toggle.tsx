import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  pressed?: boolean;
  onChange?: (pressed: boolean) => void;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onChange, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={pressed}
        onClick={() => onChange?.(!pressed)}
        className={cn(
          "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tirbeo-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          pressed ? "bg-tirbeo-blue-500" : "bg-tirbeo-neutral-300",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
            pressed ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle };
