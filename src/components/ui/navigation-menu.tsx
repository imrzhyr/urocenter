import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  cn(
    // Base styles
    "group inline-flex items-center justify-center",
    "min-h-[44px] px-4", // iOS minimum touch target
    "rounded-lg", // iOS corner radius
    "text-[17px] font-medium", // iOS system font size
    "bg-white/80 dark:bg-[#1C1C1E]/80",
    "backdrop-blur-xl",
    "text-[#000000] dark:text-white",
    "transition-all duration-200",
    "active:scale-[0.97]", // iOS press animation
    // States
    "hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=open]:bg-[#F2F2F7] dark:data-[state=open]:bg-[#2C2C2E]"
  )
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn(
        "relative ml-1 h-4 w-4",
        "text-[#8E8E93] dark:text-[#98989D]",
        "transition-transform duration-200",
        "group-data-[state=open]:rotate-180"
      )}
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "absolute left-0 top-0 w-full",
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
      "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52",
      "data-[motion=from-start]:slide-in-from-left-52",
      "data-[motion=to-end]:slide-out-to-right-52",
      "data-[motion=to-start]:slide-out-to-left-52",
      "md:absolute md:w-auto",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn(
    "absolute left-0 top-full flex justify-center",
    "w-full sm:w-auto"
  )}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "relative mt-2",
        "h-[var(--radix-navigation-menu-viewport-height)]",
        "w-full sm:w-[var(--radix-navigation-menu-viewport-width)]",
        "origin-top-center overflow-hidden",
        "rounded-xl", // iOS corner radius
        "bg-white/80 dark:bg-[#1C1C1E]/80",
        "backdrop-blur-xl",
        "border border-[#3C3C43]/20 dark:border-white/10",
        "shadow-lg",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
        "duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1]",
      "flex h-2 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
      "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      "duration-200",
      className
    )}
    {...props}
  >
    <div className={cn(
      "relative top-[60%]",
      "h-2 w-2 rotate-45",
      "rounded-tl",
      "bg-white/80 dark:bg-[#1C1C1E]/80",
      "backdrop-blur-xl",
      "border-l border-t border-[#3C3C43]/20 dark:border-white/10",
      "shadow-sm"
    )} />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
