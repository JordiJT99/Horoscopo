
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { AstroAppLogo } from '@/lib/constants';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Stars, /* Replace with actual Chinese icon */ Rabbit, /* Replace with actual Mayan icon */ Feather } from 'lucide-react';

interface AppSidebarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const AppSidebar = ({ dictionary, currentLocale }: AppSidebarProps) => {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();

  const isActive = (path: string) => {
    // For the root path, ensure it's an exact match or starts with /<locale> only
    if (path === `/${currentLocale}`) {
      return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
    }
    return pathname.startsWith(path);
  };

  const menuItems = [
    {
      href: `/${currentLocale}/`,
      label: dictionary['Sidebar.westernAstrology'] || "Western Astrology",
      icon: Stars,
      tooltip: dictionary['Sidebar.westernAstrologyTooltip'] || "Western Astrology",
    },
    {
      href: `/${currentLocale}/chinese-horoscope`,
      label: dictionary['Sidebar.chineseHoroscope'] || "Chinese Horoscope",
      icon: Rabbit, // Using Rabbit as a placeholder
      tooltip: dictionary['Sidebar.chineseHoroscopeTooltip'] || "Chinese Horoscope",
    },
    {
      href: `/${currentLocale}/mayan-horoscope`,
      label: dictionary['Sidebar.mayanHoroscope'] || "Mayan Horoscope",
      icon: Feather, // Using Feather as a placeholder
      tooltip: dictionary['Sidebar.mayanHoroscopeTooltip'] || "Mayan Horoscope",
    },
  ];

  return (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href={`/${currentLocale}/`} className="flex items-center gap-2">
          <AstroAppLogo className="h-8 w-8 text-sidebar-primary" />
          {sidebarState === 'expanded' && (
            <h2 className="text-xl font-headline font-semibold text-sidebar-foreground">
              {dictionary['Header.title'] || "AstroVibes"}
            </h2>
          )}
        </Link>
        <div className="md:hidden"> {/* Only show trigger on small screens if sidebar is part of header */}
           {/* SidebarTrigger is now in the main Header component */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.tooltip, side: 'right', className: 'bg-sidebar-accent text-sidebar-accent-foreground' }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
};

export default AppSidebar;

    