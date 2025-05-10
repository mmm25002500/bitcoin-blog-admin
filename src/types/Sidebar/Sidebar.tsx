import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface SidebarItem {
  name: string;
  icon: string | StaticImport;
  path: string;
}

export interface SidebarProps {
  // isOpen: boolean;
  // toggleSidebar: () => void;
  items: SidebarItem[];
}