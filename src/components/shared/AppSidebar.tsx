
"use client";
// This component is no longer used for the main navigation in layout.tsx
// It can be removed or repurposed if a different type of sidebar is needed elsewhere.
// For now, I'll leave its content, but it's effectively orphaned from the main layout.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { AstroAppLogo, ChineseAstrologyIcon, MayanAstrologyIcon, TarotPersonalityTestIcon } from '@/lib/constants';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  // useSidebar, // Not needed if this isn't the main sidebar anymore
  sidebarMenuButtonVariants,
} from '@/components/ui/sidebar'; // useSidebar might be removed if this component is fully decoupled
import { cn } from '@/lib/utils';
import { CalendarRange, Calendar, Users, Clover, Wand2, HeartHandshake, Sparkles, Eye, BedDouble, Orbit, Wand, HelpCircle, Edit } from 'lucide-react';

interface AppSidebarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
  onLinkClick?: () => void; // Callback to close if in a Sheet, for example
}

const AppSidebar = ({ dictionary, currentLocale, onLinkClick }: AppSidebarProps) => {
  const pathname = usePathname();
  // const { state: sidebarState, setOpenMobile, isMobile } = useSidebar(); // This context might not be available or relevant

  const isActive = (path: string) => {
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;
    const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;

    if (path === `/${currentLocale}/`) {
      return normalizedPathname === `/${currentLocale}/`;
    }
    if (path === `/${currentLocale}/onboarding` && normalizedPathname.startsWith(`/${currentLocale}/onboarding`)) {
      return true;
    }
    return normalizedPathname.startsWith(normalizedPath) && !normalizedPathname.startsWith(`/${currentLocale}/onboarding`);
  };

  const handleMenuItemClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const isHoroscopeSectionActive = () => {
    const horoscopePaths = [
      `/${currentLocale}/`,
      `/${currentLocale}/weekly-horoscope`,
      `/${currentLocale}/monthly-horoscope`,
    ];
    return horoscopePaths.some(p => isActive(p));
  };

  const mainMenuItems = [
    // These items would now likely be in the "More" dropdown in the new Header
    // Or this AppSidebar component could be used *inside* that "More" dropdown's Sheet/Dialog
    {
      href: `/${currentLocale}/compatibility`,
      label: dictionary['Sidebar.compatibility'] || "Compatibility",
      icon: HeartHandshake,
      tooltip: dictionary['Sidebar.compatibilityTooltip'] || "Check Zodiac Compatibility",
    },
    // ... other items previously here
  ];

  const horoscopeItems = [
     {
      href: `/${currentLocale}/`,
      label: dictionary['Sidebar.dailyHoroscope'] || "Daily Horoscope",
      icon: Sparkles,
      tooltip: dictionary['Sidebar.dailyHoroscopeTooltip'] || "View Daily Horoscope",
    },
    // ... other horoscope items
  ];

  return (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href={`/${currentLocale}/`} onClick={handleMenuItemClick} className="flex items-center gap-2">
          <AstroAppLogo className="h-8 w-8 text-sidebar-primary" />
          {/* Removed sidebarState check as this is now context-dependent */}
          <h2 className="text-xl font-headline font-semibold text-sidebar-foreground">
            {dictionary['Header.title'] || "AstroVibes"}
          </h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <p className="p-4 text-sm text-muted-foreground">
            {dictionary['AppSidebar.navigationMoved'] || "Navigation has moved to the top bar. This sidebar is illustrative."}
          </p>
          {/* Example of how items could be structured if this was used in a "More" menu */}
          <Accordion type="single" collapsible className="w-full" defaultValue={isHoroscopeSectionActive() ? "horoscopes" : undefined}>
            <AccordionItem value="horoscopes" className="border-none">
               <AccordionTrigger
                className={cn(
                  sidebarMenuButtonVariants({ size: 'default' }),
                  "w-full justify-between hover:bg-sidebar-primary hover:text-sidebar-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground active:bg-sidebar-primary active:text-sidebar-primary-foreground",
                  isHoroscopeSectionActive() && "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Orbit />
                  <span>{dictionary['Sidebar.horoscopesGroup'] || "Horoscopes"}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-0">
                <div className="pl-4 space-y-1">
                  {horoscopeItems.map((item) => (
                     <SidebarMenuButton
                        key={item.href}
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.tooltip, side: 'right', className: 'bg-sidebar-accent text-sidebar-accent-foreground' }}
                        className="w-full justify-start hover:bg-sidebar-primary hover:text-sidebar-foreground active:bg-sidebar-primary active:text-sidebar-primary-foreground"
                      >
                        <Link href={item.href} onClick={handleMenuItemClick}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {mainMenuItems.map((item) => (
             <SidebarMenuButton
                key={item.href}
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.tooltip, side: 'right', className: 'bg-sidebar-accent text-sidebar-accent-foreground' }}
                 className="hover:bg-sidebar-primary hover:text-sidebar-foreground data-[state=open]:hover:bg-sidebar-primary data-[state=open]:hover:text-sidebar-foreground active:bg-sidebar-primary active:text-sidebar-primary-foreground"
              >
              <Link href={item.href} onClick={handleMenuItemClick}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
};

export default AppSidebar;
