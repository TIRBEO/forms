"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { cn } from "../../lib/utils";

interface DialogContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContext | undefined>(undefined);

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, open, onOpenChange, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(open ?? false);
    const panelRef = useRef<HTMLDivElement>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);

    const handleOpenChange = (o: boolean) => {
      setIsOpen(o);
      onOpenChange?.(o);
    };

    // Lock body scroll, trap focus, close on Escape, restore focus on close.
    useEffect(() => {
      if (!isOpen) return;

      previouslyFocused.current = document.activeElement as HTMLElement;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const panel = panelRef.current;
      const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables?.[0] ?? panel)?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleOpenChange(false);
          return;
        }
        if (e.key !== "Tab" || !panel) return;

        const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = previousOverflow;
        previouslyFocused.current?.focus?.();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
      <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
        {isOpen && (
          <div
            ref={ref}
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center",
              className
            )}
            {...props}
          >
            <div
              className="fixed inset-0 bg-black/50"
              aria-hidden="true"
              onClick={() => handleOpenChange(false)}
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className="relative z-10 w-full max-w-lg rounded-lg bg-[var(--color-admin-surface)] shadow-xl outline-none"
            >
              {children}
            </div>
          </div>
        )}
      </DialogContext.Provider>
    );
  }
);

Dialog.displayName = "Dialog";

export const DialogHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
    {...props}
  />
));

DialogHeader.displayName = "DialogHeader";

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--color-admin-text-secondary)]", className)}
    {...props}
  />
));

DialogDescription.displayName = "DialogDescription";

export const DialogContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative z-10 grid gap-4 p-6", className)}
    {...props}
  />
));

DialogContent.displayName = "DialogContent";

export const DialogFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4",
      className
    )}
    {...props}
  />
));

DialogFooter.displayName = "DialogFooter";
