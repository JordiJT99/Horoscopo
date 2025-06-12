
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { AstroAppLogo, ChineseAstrologyIcon, MayanAstrologyIcon } from '@/lib/constants';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, CalendarRange, Calendar, Users, Clover, Wand2, HeartHandshake, Sparkles } from 'lucide-react';

interface AppSidebarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const AppSidebar = ({ dictionary, currentLocale }: AppSidebarProps) => {
  const pathname = usePathname();
  const { state: sidebarState, setOpenMobile, isMobile } = useSidebar();

  const isActive = (path: string) => {
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;
    const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;
    
    // Special case for home: exact match or just the locale
    if (path === `/${currentLocale}/`) {
      return normalizedPathname === `/${currentLocale}/`;
    }
    return normalizedPathname.startsWith(normalizedPath);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuItems = [
    {
      href: `/${currentLocale}/`,
      label: dictionary['Sidebar.home'] || "Home (Daily)",
      icon: Sparkles, // Changed from LayoutDashboard for a more mystical feel
      tooltip: dictionary['Sidebar.homeTooltip'] || "Daily Horoscope & Home",
    },
    {
      href: `/${currentLocale}/weekly-horoscope`,
      label: dictionary['Sidebar.weeklyHoroscope'] || "Weekly Horoscope",
      icon: CalendarRange,
      tooltip: dictionary['Sidebar.weeklyHoroscopeTooltip'] || "View Weekly Horoscope",
    },
    {
      href: `/${currentLocale}/monthly-horoscope`,
      label: dictionary['Sidebar.monthlyHoroscope'] || "Monthly Horoscope",
      icon: Calendar,
      tooltip: dictionary['Sidebar.monthlyHoroscopeTooltip'] || "View Monthly Horoscope",
    },
    {
      href: `/${currentLocale}/compatibility`,
      label: dictionary['Sidebar.compatibility'] || "Compatibility",
      icon: HeartHandshake, // Changed from Users
      tooltip: dictionary['Sidebar.compatibilityTooltip'] || "Check Zodiac Compatibility",
    },
    {
      href: `/${currentLocale}/lucky-numbers`,
      label: dictionary['Sidebar.luckyNumbers'] || "Lucky Numbers",
      icon: Clover,
      tooltip: dictionary['Sidebar.luckyNumbersTooltip'] || "Discover Lucky Numbers",
    },
    {
      href: `/${currentLocale}/lunar-ascendant`,
      label: dictionary['Sidebar.lunarAscendant'] || "Lunar & Ascendant",
      icon: Wand2, 
      tooltip: dictionary['Sidebar.lunarAscendantTooltip'] || "Lunar Phase & Ascendant Calculator",
    },
    {
      href: `/${currentLocale}/chinese-horoscope`,
      label: dictionary['Sidebar.chineseHoroscope'] || "Chinese Horoscope",
      icon: ChineseAstrologyIcon,
      tooltip: dictionary['Sidebar.chineseHoroscopeTooltip'] || "Chinese Zodiac Insights",
    },
    {
      href: `/${currentLocale}/mayan-horoscope`,
      label: dictionary['Sidebar.mayanHoroscope'] || "Mayan Horoscope",
      icon: MayanAstrologyIcon,
      tooltip: dictionary['Sidebar.mayanHoroscopeTooltip'] || "Mayan Astrological Wisdom",
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
