"use client";

import AddBtn from "@/components/Button/AddBtn";
import Search from "@/components/Input/Search";
import AuthorTable from "@/components/Table/AuthorTable";

// icon
import { AuthorData } from "@/types/Table/AuthorTable";

import { useRouter } from "next/navigation";
import { useState } from "react";

const data: AuthorData[] = [
  {
    id: "1",
    name: "作者1",
    postQuantity: 10,
    description: "這是作者1的描述",
    image: "/images/author1.jpg",
  },
  {
    id: "2",
    name: "作者2",
    postQuantity: 5,
    description: "這是作者2的描述",
    image: "/images/author2.jpg",
  },
  {
    id: "3",
    name: "作者3",
    postQuantity: 8,
    description: "這是作者3的描述",
    image: "/images/author3.jpg",
  },
  {
    id: "4",
    name: "作者4",
    postQuantity: 12,
    description: "這是作者4的描述",
    image: "/images/author4.jpg",
  },
  {
    id: "5",
    name: "作者5",
    postQuantity: 15,
    description: "這是作者5的描述",
    image: "/images/author5.jpg",
  },
  {
    id: "6",
    name: "作者6",
    postQuantity: 20,
    description: "這是作者6的描述",
    image: "/images/author6.jpg",
  },
  {
    id: "7",
    name: "作者7",
    postQuantity: 25,
    description: "這是作者7的描述",
    image: "/images/author7.jpg",
  },
  {
    id: "8",
    name: "作者8",
    postQuantity: 30,
    description: "這是作者8的描述",
    image: "/images/author8.jpg",
  },
  {
    id: "9",
    name: "作者9",
    postQuantity: 35,
    description: "這是作者9的描述",
    image: "/images/author9.jpg",
  },
  {
    id: "10",
    name: "作者10",
    postQuantity: 40,
    description: "這是作者10的描述",
    image: "/images/author10.jpg",
  },
  {
    id: "11",
    name: "作者11",
    postQuantity: 45,
    description: "這是作者11的描述",
    image: "/images/author11.jpg",
  },
  {
    id: "12",
    name: "作者12",
    postQuantity: 50,
    description: "這是作者12的描述",
    image: "/images/author12.jpg",
  },
  {
    id: "13",
    name: "作者13",
    postQuantity: 55,
    description: "這是作者13的描述",
    image: "/images/author13.jpg",
  },
  {
    id: "14",
    name: "作者14",
    postQuantity: 60,
    description: "這是作者14的描述",
    image: "/images/author14.jpg",
  },
];

const NewsManage = () => {
  // 搜尋框的值
  const [searchValue, setSearchValue] = useState<string>("");
  console.log("搜尋框的值:", searchValue);

  // 處理路由變化
  const router = useRouter();


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

  return (
    <>
      {/* nav */}
      <div className="flex">
        <div className="flex gap-5 grow">
          <Search
            onChange={handleSearchChange}
            onCancel={handleSearchCancel}
          />
        </div>
        <div>
          <AddBtn
            onClick={() => router.push("/Manage/Create/Author")}
            label={"新增 +"}
            className=""
          />
        </div> 
      </div>

      {/* 文章列表 */}
      <AuthorTable
        perPage={10}
        searchValue={searchValue}
        onDelete={() => console.log("刪除")}
        AuthorData={data}
      />
    </>
  );
}

export default NewsManage; 