import {
  Calendar,
  Landmark,
  Store,
  School,
  CupSoda,
  Factory,
  TableRowsSplit,
  Cuboid,
  Apple,
  TableCellsSplit,
  Amphora,
  CirclePercent,
  LogOut,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const SIDEBAR_WIDTH = "10rem";
const SIDEBAR_WIDTH_MOBILE = "10rem";

// Menu items.
const items1 = [
  {
    title: "Календар",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Статистика",
    url: "#",
    icon: ChartNoAxesCombined,
  },
];
const items2 = [
  {
    title: "Ресторан",
    url: "#",
    icon: Landmark,
  },
  {
    title: "Чайкана",
    url: "#",
    icon: Store,
  },
  {
    title: "Баня",
    url: "#",
    icon: School,
  },
  {
    title: "Баня-Товар",
    url: "#",
    icon: CupSoda,
  },
  {
    title: "Пескоблок",
    url: "#",
    icon: Cuboid,
  },
  {
    title: "Пилорама",
    url: "#",
    icon: TableRowsSplit,
  },
  {
    title: "Тегирмен",
    url: "#",
    icon: Factory,
  },
  {
    title: "Алма",
    url: "#",
    icon: Apple,
  },
  {
    title: "Ун",
    url: "#",
    icon: TableCellsSplit,
  },
  {
    title: "Май",
    url: "#",
    icon: Amphora,
  },
  {
    title: "Гуруч",
    url: "#",
    icon: CirclePercent,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="mt-2">
        <SidebarGroupLabel>Башкы</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items1.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge>24</SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarSeparator />

          <SidebarGroupLabel>Бизнес</SidebarGroupLabel>
          <SidebarMenu>
            {items2.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge>7</SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {/* <SidebarSeparator /> */}
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 mb-4">
            <LogOut className="h-4 w-4" />
            <span>Чыгуу</span>
          </div>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
