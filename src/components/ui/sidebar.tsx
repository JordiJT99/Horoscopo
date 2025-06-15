
"use client"

import * as React from "react"
// This component is largely being deprecated in favor of a top navigation bar
// Some parts might be repurposed for a "More" menu dropdown or sheet.
// The main sidebar layout logic is removed from here and `layout.tsx`.

import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { Menu } from "lucide-react" 

// import { useIsMobile } from "@/hooks/use-mobile" // May not be needed here anymore
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input" // Likely unused now
// import { Separator } from "@/components/ui/separator" // Likely unused now
// import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet" // This logic moved to layout.tsx
// import { Skeleton } from "@/components/ui/skeleton" // Likely unused now
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type SidebarContext = {
  // These states are less relevant now with the top-nav design
  state: "expanded" | "collapsed" 
  open: boolean 
  setOpen: (open: boolean) => void
  openMobile: boolean 
  setOpenMobile: (open: boolean) => void // This might be used by the "More" menu if it opens a sheet
  isMobile: boolean // Still useful generally
  toggleSidebar: () => void // Would now toggle the "More" menu sheet if implemented
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    // This error might be too strict if sidebar is truly optional/replaced
    // throw new Error("useSidebar must be used within a SidebarProvider.")
    // Return a default/mock context or handle differently if SidebarProvider is removed
    console.warn("useSidebar called outside of SidebarProvider; this might be due to new nav structure.");
    return { // Provide a fallback to prevent crashes, though these values might not be functional
        state: "collapsed", open: false, setOpen: () => {},
        openMobile: false, setOpenMobile: () => {},
        isMobile: false, // This should ideally come from a hook like useIsMobile
        toggleSidebar: () => {}
    } as SidebarContext;
  }
  return context
}

// SidebarProvider might be removed from the main layout.tsx.
// If kept, its role and defaultOpen would change significantly.
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean 
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = false, 
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // const isMobile = useIsMobile() // This hook should be used if needed
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false; // Simplified for now
    const [openMobile, setOpenMobile] = React.useState(false) 
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open

    const setOpen = React.useCallback( 
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      // This would now likely control the "More" menu if it's a sheet
      setOpenMobile((current) => !current);
    }, [setOpenMobile])

    const state = open ? "expanded" : "collapsed" 

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state, 
        open,  
        setOpen, 
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

// Sidebar component is visually removed from main layout. Kept for potential re-use.
const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>
  (({ className, ...props }, ref) => (
    <div ref={ref} className={cn("hidden", className)} {...props} />
));
Sidebar.displayName = "Sidebar";

// SidebarTrigger is now the main menu icon in the Header.tsx
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar() 
      }}
      {...props}
    >
      <Menu /> 
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// SidebarInset's role changes; it's now the main content area.
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col", 
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"


// The following components (Header, Footer, Content, Group, Menu related)
// are likely to be unused in their current form if AppSidebar.tsx is removed
// or significantly re-purposed for the "More" menu.

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2 mt-auto", className)} // Added mt-auto
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1 p-2", className)} // Added padding
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-primary hover:text-sidebar-foreground focus-visible:ring-2 active:bg-sidebar-primary active:text-sidebar-primary-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-sidebar text-sidebar-foreground", 
        outline: "bg-transparent border border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-10 text-base", 
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) { 
      return button
    }
    if (typeof tooltip === "string") {
      tooltip = { children: tooltip }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" align="center" {...tooltip} />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"


export {
  // Sidebar, // Potentially remove if not used
  SidebarContent,
  SidebarFooter,
  // SidebarGroup, // And its sub-components if not used
  // SidebarGroupAction,
  // SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarHeader,
  // SidebarInput, // If not used
  SidebarInset,
  SidebarMenu,
  // SidebarMenuAction, // If not used
  // SidebarMenuBadge, // If not used
  SidebarMenuButton,
  sidebarMenuButtonVariants, 
  // SidebarMenuItem, // If not used
  // SidebarMenuSkeleton, // If not used
  // SidebarMenuSub, // And its sub-components if not used
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
  SidebarProvider, // May need to be rethought or removed
  // SidebarRail, // Likely not needed
  // SidebarSeparator, // If not used
  SidebarTrigger, // This is the hamburger icon now
  useSidebar,
}
