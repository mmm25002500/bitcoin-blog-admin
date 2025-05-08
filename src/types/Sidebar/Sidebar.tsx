interface SidebarItem {
  name: string;
  icon?: string;
  path: string;
}

export interface SidebarProps {
  // isOpen: boolean;
  // toggleSidebar: () => void;
  items: SidebarItem[];
}