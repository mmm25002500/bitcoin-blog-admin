"use client";

import AddBtn from "@/components/Button/AddBtn";
import Search from "@/components/Input/Search";
import AuthorTable from "@/components/Table/AuthorTable";

// icon
import { AuthorData } from "@/types/Table/AuthorTable";

import { useRouter } from 'nextjs-toploader/app';
import { useState } from "react";

const data: AuthorData[] = [
  {
    id: "1",
    name: "中本蔥",
    postQuantity: 10,
    description: "這是作者1的描述",
    image: "https://cdn2.ettoday.net/images/544/d544678.jpg",
  },
  {
    id: "2",
    name: "區塊鏈日報",
    postQuantity: 5,
    description: "這是作者2的描述",
    image: "https://yt3.googleusercontent.com/rbOYRHgDx7zXUGeSjYuxcKhp3I7kEwsT8gK8BzWMnAmdjJ8e_peHYRUG0t38dClCojUg7AnZrA=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    id: "3",
    name: "邦尼",
    postQuantity: 8,
    description: "這是作者3的描述",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWvqNtp8y0QVSSwaBJlU9Vsm_BT5_J_TQliw&s",
  },
  {
    id: "4",
    name: "墨山貓",
    postQuantity: 12,
    description: "這是作者4的描述",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpavIT5Qet-fEl4TUVHmlDMCWyxdcc1jII5Q&s",
  },
  {
    id: "5",
    name: "腦哥",
    postQuantity: 15,
    description: "這是作者5的描述",
    image: "https://yt3.googleusercontent.com/ytc/AIdro_lhPNbGbpbGd6cHcUVc01gedGOZTCxMISdfRKOu9BxaDA=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    id: "6",
    name: "川普",
    postQuantity: 20,
    description: "這是作者6的描述",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSukLUvlHhrVTxop0dh1I5ew_2P3w1HvBBKPQ&s",
  },
  {
    id: "7",
    name: "拜登",
    postQuantity: 25,
    description: "這是作者7的描述",
    image: "/images/author7.jpg",
  },
  {
    id: "8",
    name: "Michael Saylor",
    postQuantity: 30,
    description: "這是作者8的描述",
    image: "/images/author8.jpg",
  },
  {
    id: "9",
    name: "SBF",
    postQuantity: 35,
    description: "這是作者9的描述",
    image: "/images/author9.jpg",
  },
  {
    id: "10",
    name: "Do kwan",
    postQuantity: 40,
    description: "這是作者10的描述",
    image: "/images/author10.jpg",
  },
  {
    id: "11",
    name: "Vitalik Buterin",
    postQuantity: 45,
    description: "這是作者11的描述",
    image: "/images/author11.jpg",
  },
  {
    id: "12",
    name: "Anatoly Yakovenko",
    postQuantity: 50,
    description: "這是作者12的描述",
    image: "/images/author12.jpg",
  },
  {
    id: "13",
    name: "Luke Dashjr",
    postQuantity: 55,
    description: "這是作者13的描述",
    image: "/images/author13.jpg",
  },
  {
    id: "14",
    name: "阿曼多·布格磊",
    postQuantity: 60,
    description: "這是作者14的描述",
    image: "/images/author14.jpg",
  },
  {
    id: "15",
    name: "王小明",
    postQuantity: 65,
    description: "這是作者15的描述",
    image: "/images/author15.jpg",
  }
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