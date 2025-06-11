
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { AstroAppLogo, ChineseAstrologyIcon, MayanAstrologyIcon, WesternAstrologyIcon } from '@/lib/constants';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const AppSidebar = ({ dictionary, currentLocale }: AppSidebarProps) => {
  const pathname = usePathname();
  const { state: sidebarState, setOpenMobile, isMobile } = useSidebar();

  const isActive = (path: string) => {
    if (path === `/${currentLocale}` || path === `/${currentLocale}/`) {
      const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;
      const normalizedLocalePath = `/${currentLocale}/`;
      return normalizedPathname === normalizedLocalePath;
    }
    return pathname.startsWith(path);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuItems = [
    {
      href: `/${currentLocale}/`,
      label: dictionary['Sidebar.westernAstrology'] || "Western Astrology",
      icon: WesternAstrologyIcon,
      tooltip: dictionary['Sidebar.westernAstrologyTooltip'] || "Western Astrology",
    },
    {
      href: `/${currentLocale}/chinese-horoscope`,
      label: dictionary['Sidebar.chineseHoroscope'] || "Chinese Horoscope",
      icon: ChineseAstrologyIcon,
      tooltip: dictionary['Sidebar.chineseHoroscopeTooltip'] || "Chinese Horoscope",
    },
    {
      href: `/${currentLocale}/mayan-horoscope`,
      label: dictionary['Sidebar.mayanHoroscope'] || "Mayan Horoscope",
      icon: MayanAstrologyIcon,
      tooltip: dictionary['Sidebar.mayanHoroscopeTooltip'] || "Mayan Horoscope",
    },
  ];

  return (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href={`/${currentLocale}/`} onClick={handleMenuItemClick} className="flex items-center gap-2">
          <AstroAppLogo className="h-8 w-8 text-sidebar-primary" />
          {sidebarState === 'expanded' && (
            <h2 className="text-xl font-headline font-semibold text-sidebar-foreground">
              {dictionary['Header.title'] || "AstroVibes"}
            </h2>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.tooltip, side: 'right', className: 'bg-sidebar-accent text-sidebar-accent-foreground' }}
              >
                <Link href={item.href} onClick={handleMenuItemClick}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
};

export default AppSidebar;
