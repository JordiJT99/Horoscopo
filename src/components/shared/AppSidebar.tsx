
"use client";

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
  useSidebar,
  sidebarMenuButtonVariants,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { CalendarRange, Calendar, Users, Clover, Wand2, HeartHandshake, Sparkles, Eye, BedDouble, Orbit, Wand, HelpCircle, Edit } from 'lucide-react'; // Added Edit

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

    if (path === `/${currentLocale}/`) { // Home/Daily Horoscope
      return normalizedPathname === `/${currentLocale}/`;
    }
    // Check for onboarding page as well
    if (path === `/${currentLocale}/onboarding` && normalizedPathname.startsWith(`/${currentLocale}/onboarding`)) {
      return true;
    }
    return normalizedPathname.startsWith(normalizedPath) && !normalizedPathname.startsWith(`/${currentLocale}/onboarding`);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
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
    {
      href: `/${currentLocale}/compatibility`,
      label: dictionary['Sidebar.compatibility'] || "Compatibility",
      icon: HeartHandshake,
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
     {
      href: `/${currentLocale}/crystal-ball`,
      label: dictionary['Sidebar.crystalBall'] || "Crystal Ball",
      icon: Eye,
      tooltip: dictionary['Sidebar.crystalBallTooltip'] || "Consult the Crystal Ball",
    },
    {
      href: `/${currentLocale}/dream-reading`,
      label: dictionary['Sidebar.dreamReading'] || "Dream Reading",
      icon: BedDouble,
      tooltip: dictionary['Sidebar.dreamReadingTooltip'] || "Interpret Your Dreams",
    },
    {
      href: `/${currentLocale}/tarot-reading`,
      label: dictionary['Sidebar.tarotReading'] || "Tarot Reading",
      icon: Wand,
      tooltip: dictionary['Sidebar.tarotReadingTooltip'] || "Get a Tarot Card Reading",
    },
    {
      href: `/${currentLocale}/tarot-personality-test`,
      label: dictionary['Sidebar.tarotPersonalityTest'] || "Your Tarot Card",
      icon: TarotPersonalityTestIcon, // Using HelpCircle via constants
      tooltip: dictionary['Sidebar.tarotPersonalityTestTooltip'] || "Discover Your Tarot Personality Card",
    },
    {
      href: `/${currentLocale}/onboarding`, // New Onboarding Link
      label: dictionary['Sidebar.onboarding'] || "Complete Profile",
      icon: Edit,
      tooltip: dictionary['Sidebar.onboardingTooltip'] || "Complete your onboarding profile",
    },
  ];

  const horoscopeItems = [
     {
      href: `/${currentLocale}/`,
      label: dictionary['Sidebar.dailyHoroscope'] || "Daily Horoscope",
      icon: Sparkles,
      tooltip: dictionary['Sidebar.dailyHoroscopeTooltip'] || "View Daily Horoscope",
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
