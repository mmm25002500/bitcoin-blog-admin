import { StaticImport } from "next/dist/shared/lib/get-img-props";

// 建立 User 的 Props，然後把 userName 放入。

export interface NavbarProps {
  title: string;
  logo: string | StaticImport;
  userName?: string;
  className?: string;
}