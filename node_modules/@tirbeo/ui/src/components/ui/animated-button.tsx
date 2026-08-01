"use client";

import React from "react";
import { cn } from "../../lib/utils";

type AnimatedButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: React.ReactNode;
  as?: React.ElementType;
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children = "Browse Components",
  className = "",
  as: Component = "button",
  ...rest
}) => {
  return (
    <Component
      {...rest}
      className={cn(
        "group inline-flex items-center justify-center px-6 py-2 rounded-md relative overflow-hidden bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-[#222]",
        "text-neutral-900 dark:text-neutral-100 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span className="tracking-wide font-light flex items-center justify-center h-full w-full relative z-10">
        {children}
      </span>
    </Component>
  );
};

export default AnimatedButton;
