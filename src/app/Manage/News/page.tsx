"use client";

import AddBtn from "@/components/Button/AddBtn";
import DateChoose from "@/components/Input/DateChoose";
import DropDown from "@/components/Input/DropDown";
import Search from "@/components/Input/Search";
import PostTable from "@/components/Table/PostTable";
import { PostData } from "@/types/Table/PostTable";
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const mockData: PostData[] = Array.from({ length: 100 }, (_, i) => ({
  id: `#1231${i}`,
  title: i % 2 === 0 ? `台灣比特幣儲備 ${i+1}` : `以太坊升級 ${i+1}`,
  author: i % 2 === 0 ? `Vitalik ${i+1}` : `Michael Saylor ${i+1}`,
  date: `2025/05/11 12:2${i}`,
  tag: ["薩爾瓦多", '挖礦', 'Solidity'],
  type: i % 2 === 0 ? "比特幣" : "智能合約",
}));

const NewsManage = () => {
  // 文章類型選單
  const [selectedOption, setSelectedOption] = useState<string>("");
  // 搜尋框的值
  const [searchValue, setSearchValue] = useState<string>("");
  // 日期選擇的值
  const [date, setDate] = useState<DateRange | undefined>();

  // 處理路由變化
  const router = useRouter();

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

  // 處理要刪除的項目
  const handleDeleteSelected = (id: string[]) => {
    console.log("要刪除的 ID：", id);
  };

  return (
    <>
      {/* nav */}
      <div className="flex">
        <div className="flex gap-5 grow">
          <DateChoose
            selected={undefined}
            onSelect={handleDateSelect}
            onCancel={handleDateCancel}
          />
          <DropDown
            options={ArticleType}
            selectedOption={selectedOption}
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
            onClick={() => router.push("/Manage/Create/Post")}
            label={"新增 +"}
            className=""
          />
        </div> 
      </div>

      {/* 文章列表 */}
      <PostTable
        perPage={10}
        type={selectedOption}
        searchValue={searchValue}
        date={date}
        onDelete={handleDeleteSelected}
        PostData={mockData}
      />
    </>
  );
}

export default NewsManage; 