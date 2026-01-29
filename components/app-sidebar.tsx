import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
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
  UserRoundPen,
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
      <SidebarHeader className="p-0">
        <div className="flex items-center justify-between px-1 py-2">
          Финансы
          <SidebarTrigger  />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
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

          <SidebarMenu>
            {items2.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarSeparator />
      
      <SidebarFooter className="p-0">
        <div className="flex items-center  gap-2 px-2 py-2">
          <LogOut className="h-4 w-4" />
          <span>Чыгуу</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
