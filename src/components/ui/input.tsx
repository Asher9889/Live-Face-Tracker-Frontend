import * as React from "react"
import { cn } from "@/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          `
          flex h-11 w-full rounded-lg
          border
          bg-background
          px-4 py-2.5 text-sm
          placeholder:text-muted-foreground
          transition-all duration-200
          outline-none

          hover:border-gray-400

          focus-visible:ring-2
          focus-visible:ring-black


          disabled:cursor-not-allowed
          disabled:opacity-60

          file:border-0 file:bg-transparent file:text-sm file:font-medium
        `,
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
export { Input }
