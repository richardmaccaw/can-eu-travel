/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-deprecated, react-x/no-forward-ref */
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

interface DialogPortalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> {
  className?: string
}
const DialogPortal = ({ className, ...props }: DialogPortalProps) => (
  <DialogPrimitive.Portal {...props}>
    <div className={cn("fixed inset-0 z-50 flex items-start justify-center sm:items-center", className)}>
      {props.children}
    </div>
  </DialogPrimitive.Portal>
)
DialogPortal.displayName = DialogPrimitive.Portal.displayName

const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>( (
  { className, ...props }, ref ) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-50 bg-background/80 backdrop-blur-md transition-all",
        className
      )}
      {...props}
    />
  )
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>( (
  { className, ...props }, ref ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 grid w-full gap-4 rounded-b-lg border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-lg",
          className
        )}
        {...props}
      />
    </DialogPortal>
  )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>( (
  { className, ...props }, ref ) => (
    <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>( (
  { className, ...props }, ref ) => (
    <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogClose = DialogPrimitive.Close

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
}
