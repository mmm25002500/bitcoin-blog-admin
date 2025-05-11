"use client";

import AddBtn from "@/components/Button/AddBtn";
import DateSelection from "@/components/Input/DateSelection";
import DropDown from "@/components/Input/DropDown";
import Search from "@/components/Input/Search";
import LayoutIndex from "@/components/Layout/LayoutIndex";

// icon
import PostIcon from "@/images/post_icon.svg";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const PageManage = () => {
  // 文章類型選單
  const [selectedOption, setSelectedOption] = useState<string>("");
  // 搜尋框的值
  const [searchValue, setSearchValue] = useState<string>("");
  // 日期選擇的值
  const [date, setDate] = useState<DateRange | undefined>();

  const ArticleType = [
    'All',
    'News',
    'Post'
  ];

  // 處理下拉選單的選擇
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`選擇的文章類型: ${option}`);
  };

  // 處理取消按鈕的點擊事件
  const handleDropDownCancel = () => {
    setSelectedOption("All");
  }

  // 處理搜尋框的變化
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    console.log(`搜尋的值: ${value}`);
  };

  // 處理搜尋框的取消按鈕點擊事件
  const handleSearchCancel = () => {
    setSearchValue("");
    console.log("搜尋框取消");
  };

  useEffect(() => {
    if (selectedOption) {
      console.log(`真正選到的文章類型: ${selectedOption}`);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (searchValue) {
      console.log(`搜尋的值: ${searchValue}`);
    }
  }, [searchValue]);

  useEffect(() => {
    if (date) {
      console.log(`選擇的日期範圍: ${date}`);
    }
  }, [date]);

  // 處理日期選擇的變化
  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    console.log(`選擇的日期範圍: ${range}`);
  };

  // 處理日期選擇的取消按鈕點擊事件
  const handleDateCancel = () => {
    setDate(undefined);
    console.log("日期選擇取消");
  };

  return (
    <LayoutIndex title="文章管理" logo={PostIcon}>
      <div className="flex">
        <div className="flex gap-5 grow">
          <DateSelection
            selected={undefined}
            onSelect={handleDateSelect}
            onCancel={handleDateCancel}
          />
          <DropDown
            options={ArticleType}
            selectedOption={"ss"}
            onCancel={handleDropDownCancel}
            onSelect={handleSelect}
          />
          <Search
            onChange={handleSearchChange}
            onCancel={handleSearchCancel}
          />
        </div>
        <div>
          <AddBtn
            onClick={() => console.log("新增文章")}
            label={"新增 +"}
            className=""
          />
        </div>
      </div>
    </LayoutIndex>
  );
}

export default PageManage; 