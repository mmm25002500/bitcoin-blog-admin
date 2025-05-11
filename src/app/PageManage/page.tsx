"use client";

import DateSelection from "@/components/Input/DateSelection";
import DropDown from "@/components/Input/DropDown";
import LayoutIndex from "@/components/Layout/LayoutIndex";

// icon
import PostIcon from "@/images/post_icon.svg";
import { useEffect, useState } from "react";

const PageManage = () => {
  // 文章類型選單
  const [selectedOption, setSelectedOption] = useState<string>("");

  const ArticleType = [
    'All',
    'News',
    'Post'
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`選擇的文章類型: ${option}`);
  };

  const handleCancel = () => {
    setSelectedOption("All");
  }

  useEffect(() => {
    if (selectedOption) {
      console.log(`真正選到的文章類型: ${selectedOption}`);
    }
  }, [selectedOption]);

  return (
    <LayoutIndex title="文章管理" logo={PostIcon}>
      <div className="flex gap-5">
        <DateSelection />
        <DropDown
          options={ArticleType}
          selectedOption={"ss"}
          onCancel={handleCancel}
          onSelect={handleSelect}
        />
      </div>
    </LayoutIndex>
  );
}

export default PageManage; 