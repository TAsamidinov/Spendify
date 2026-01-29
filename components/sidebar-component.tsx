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
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Статистика",
    url: "/dashboard/statistics",
    icon: ChartNoAxesCombined,
  },
];
const items2 = [
  {
    title: "Ресторан",
    url: "/dashboard/restoran",
    icon: Landmark,
  },
  {
    title: "Чайкана",
    url: "/dashboard/cafe",
    icon: Store,
  },
  {
    title: "Баня",
    url: "/dashboard/spa",
    icon: School,
  },
  {
    title: "Баня-Товар",
    url: "/dashboard/drinks",
    icon: CupSoda,
  },
  {
    title: "Пескоблок",
    url: "/dashboard/factory",
    icon: Cuboid,
  },
  {
    title: "Пилорама",
    url: "/dashboard/cutter",
    icon: TableRowsSplit,
  },
  {
    title: "Тегирмен",
    url: "/dashboard/mill",
    icon: Factory,
  },
  {
    title: "Алма",
    url: "/dashboard/apple",
    icon: Apple,
  },
  {
    title: "Ун",
    url: "flour",
    icon: TableCellsSplit,
  },
  {
    title: "Май",
    url: "oil",
    icon: Amphora,
  },
  {
    title: "Гуруч",
    url: "rice",
    icon: CirclePercent,
  },
];

export function SidebarComponent() {
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
