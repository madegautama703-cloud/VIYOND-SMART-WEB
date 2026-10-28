import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-white text-[#081530] hover:bg-blue-50 shadow-md shadow-black/20",
        primary:
          "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/30",
        action:
          "bg-[#1d63dc] text-white hover:bg-blue-500 shadow-md shadow-blue-900/40",
        glass:
          "bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md",
        outline:
          "border border-blue-400/30 bg-transparent text-white hover:bg-blue-950/40",
        secondary:
          "bg-[#0d224c] text-blue-100 border border-blue-400/25 hover:bg-[#122b5e]",
        destructive:
          "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
        ghost:
          "text-blue-100 hover:text-white hover:bg-white/10",
        success:
          "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-8 px-3.5 text-[11px]",
        lg: "h-12 px-6 text-sm",
        icon: "h-11 w-11 p-0 shrink-0",
        iconSm: "h-9 w-9 p-0 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
