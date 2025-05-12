'use client';

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

// icon
import NewsIcon from "@/images/news_icon.svg";
import PostIcon from "@/images/post_icon.svg";
import AuthorIcon from "@/images/author_icon.svg";

const routeInfo = {
  "/Manage/Post": { title: "文章管理", logo: PostIcon },
  "/Manage/News": { title: "新聞管理", logo: NewsIcon },
  "/Manage/Author": { title: "作者管理", logo: AuthorIcon },
  "/Manage/Create/Post": { title: "文章管理｜新增文章", logo: PostIcon },
  "/Manage/Create/Author": { title: "作者管理｜新增作者", logo: AuthorIcon },
  "/Manage/Edit/Author": { title: "作者管理｜編輯作者", logo: AuthorIcon },
  "/Manage/Edit/Post": { title: "作者管理｜編輯文章", logo: PostIcon },
};

const ManageLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // 自動根據當前路由決定標題與 logo
  const current = Object.entries(routeInfo).find(([key]) =>
    pathname?.startsWith(key)
  )?.[1] || { title: "後台管理", logo: NewsIcon };

  const item = [
    { name: '文章管理', path: '/Manage/Post', icon: PostIcon },
    { name: '新聞管理', path: '/Manage/News', icon: NewsIcon },
    { name: '作者管理', path: '/Manage/Author', icon: AuthorIcon }
  ];

  return (
    <div className="flex min-h-screen h-full bg-[#F3F7FA]">
      <Sidebar items={item} />

      <div className="flex flex-col flex-1 overflow-hidden ml-64">
        <Navbar
          title={current.title}
          logo={current.logo}
          userName="測試"
          className="px-4"
        />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col min-h-full p-4 border-gray-200 border-dashed rounded-lg bg-white relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageLayout;
