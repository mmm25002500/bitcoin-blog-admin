"use client";

import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import DeleteBtn from "@/components/Button/DeleteBtn";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import UploadFile from "@/components/UploadFile/UploadFile";
import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import toast from "react-hot-toast";

import DateChoose from "@/components/Input/DateChoose";
import DropDown from "@/components/Input/DropDown";
import Search from "@/components/Input/Search";
import PostTable from "@/components/Table/PostTable";
import type { PostData } from "@/types/Table/PostTable";
import type { DateRange } from "react-day-picker";
import { useParams } from "next/navigation";
import { fullscreen } from "@uiw/react-md-editor";

// TODO:
// 1. 更改圖片和名稱描述功能
// 2. 新增完文章後跳轉回來本頁面
// 3. 更改完文章後跳轉回來本頁面
// 4. 刪除作者功能

// const mockData: PostData[] = Array.from({ length: 100 }, (_, i) => ({
//   id: `#1231${i}`,
//   title: "sdsd",
//   author_id: i % 2 === 0 ? `Derek ${i + 1}` : `中本蔥 ${i + 1}`,
//   created_at: `2025/05/11 12:2${i}`,
//   tags: ["區塊鏈日報", "墨山貓", "良兮"],
//   type: i % 2 === 0 ? ["走勢分析"] : ["總體經濟"],
//   img: i % 2 === 0 ? "/images/author1.png" : "/images/author2.png",
//   description: "sd",
//   filename: "dfdf",
// }));

const EditAuthor = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>(""); // 顯示舊圖或新圖
  // const [initPreviewUrl, setInitPreviewUrl] = useState<string>(""); // 儲存初始的預覽圖 URL

  // const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // 處理路由變化
  const router = useRouter();

  // get postID
  const params = useParams();
  const UID = params?.UID as string;

  useEffect(() => {
    if (!UID) return;

    const fetchAuthor = async () => {
      try {
        const res = await fetch("/api/author/getAuthorByUID", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: UID }),
        });

        const result = await res.json();

        if (result.success) {
          const author = result.data;
          setName(author.name || "");
          setDescription(author.description || "");

          if (author.image) {
            setPreviewUrl(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/author.image/${author.image}`
            );
          }

        } else {
          console.error("取得作者失敗：", result.error);
        }
      } catch (err) {
        console.error("fetch 失敗：", err);
      }
    };

    fetchAuthor();
  }, [UID]);

  useEffect(() => {
    console.log("imageFile", imageFile);
  }, [imageFile]);

  // 文章類型選單選項
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  // 文章類型選單
  const [selectedOption, setSelectedOption] = useState<string>("All");
  // 搜尋框的值
  const [searchValue, setSearchValue] = useState<string>("");
  // 日期選擇的值
  const [date, setDate] = useState<DateRange | undefined>();

  // 處理下拉選單的選擇
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`選擇的文章類型: ${option}`);
  };

  // 處理取消按鈕的點擊事件
  const handleDropDownCancel = () => {
    setSelectedOption("All");
  };

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

  // 取得文章列表
  useEffect(() => {
    if (!UID) return;

    const fetchData = async () => {
      try {
        const [postRes, newsRes] = await Promise.all([
          fetch("/api/Post/getPostsByUID", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: UID }),
          }),
          fetch("/api/News/getPostsByUID", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: UID }),
          }),
        ]);

        const postResult = await postRes.json();
        const newsResult = await newsRes.json();

        const postData = postResult.success ? postResult.data : [];
        const newsData = newsResult.success ? newsResult.data : [];

        setPosts([...postData, ...newsData]);
      } catch (err) {
        console.error("伺服器錯誤", err);
      }
    };

    fetchData();
  }, [UID]);

  // 一開始載入時取得文章類型選單的選項
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`/api/types/getAllTypes?author_id=${UID}`);
        const result = await res.json();

        if (result.success) {
          setTypeOptions(["All", ...result.types]); // 預設 All
        } else {
          console.error("取得 types 失敗：", result.error);
        }
      } catch (err) {
        console.error("types API 錯誤：", err);
      }
    };

    fetchTypes();
  }, [UID]);

  // 篩選文章資料
  const filteredData = posts.filter((post) => {
    // 搜尋關鍵字
    const keyword = searchValue.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(keyword) ||
      post.description?.toLowerCase().includes(keyword);

    // 篩選文章類型
    const matchesType =
      selectedOption === "All" ? true : post.type?.includes(selectedOption);

    // 篩選日期
    let matchesDate = true;
    if (date?.from || date?.to) {
      const postDate = new Date(post.created_at);
      const from = date.from;
      const to = date.to
        ? new Date(
          date.to.getFullYear(),
          date.to.getMonth(),
          date.to.getDate(),
          23,
          59,
          59,
          999
        )
        : undefined;

      matchesDate =
        (!from || postDate >= from) && (!to || postDate <= to);
    }

    return matchesSearch && matchesType && matchesDate;
  });

  console.log("filteredData", filteredData);

  // 提交編輯
  const handleSubmit = async () => {
    if (!name || !description) {
      alert("請填寫完整欄位");
      return;
    }

    const formData = new FormData();

    formData.append("id", UID); // 更新必填
    formData.append("name", name);
    formData.append("description", description);

    // 如果有新圖片才 append
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("img", previewUrl);
    }

    const res = await fetch("/api/author/editAuthor", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      console.log("作者更新成功！");
      router.push("/Manage/Author");
    } else {
      console.error("更新失敗：", result.error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-full gap-5 relative">
        {/* 表單區塊 */}
        <div className="flex-1 flex flex-col gap-5 grow">
          {/* 作者名稱 */}
          <div className="flex flex-col gap-2">
            <Label text="作者名稱" htmlFor="name" required className="mb-2" />
            <Input
              name="name"
              id="name"
              placeholder="請輸入名稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 作者簡介 */}
          <div className="flex flex-col gap-2">
            <Label
              text="作者簡介"
              htmlFor="description"
              required
              className="mb-2"
            />
            <Input
              name="description"
              id="description"
              placeholder="請輸入作者簡介"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 作者頭貼 */}
          <div className="flex flex-col gap-0 grow w-[502px]">
            <Label text="作者頭貼" htmlFor="image" required />
            <span className="text-xs text-[#7C7C7C] mb-2">
              僅限上傳 .jpg、.png 檔案，比例為 1:1
            </span>

            <UploadFile
              previewUrl={previewUrl}
              onChange={(file) => {
                setImageFile(file);
              }}
              onDrop={(file) => {
                setImageFile(file);
                setPreviewUrl('');
              }}
            />
          </div>

          <div className="px-4 pt-4 border-[1px] border-neutral-200 rounded-xl">
            <Label text="文章列表" htmlFor="name" className="mb-2" />

            {/* nav */}
            <div className="flex mt-3">
              <div className="flex gap-5 grow">
                <DateChoose
                  selected={undefined}
                  onSelect={handleDateSelect}
                  onCancel={handleDateCancel}
                />
                <DropDown
                  options={typeOptions}
                  selectedOption={selectedOption}
                  label_name={"文章類型"}
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
                  onClick={() => router.push(`/Manage/Create/Post/?author_id=${UID}`)}
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
              PostData={filteredData}
            />
          </div>
        </div>
      </div>

      {/* 按鈕區塊 */}
      <div className="pt-20">
        <div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-end gap-2 pr-7">
            <DeleteBtn
              label="刪除"
              onClick={() => {
                router.push("/Manage/Author");
                toast.success("文章已成功刪除");
              }}
            />
            <CancelBtn
              label="發佈"
              onClick={handleSubmit}
            />
            {/* <AddBtn
              label="儲存"
              onClick={() => {
                router.push("/Manage/Author");
                toast.success("文章已成功刪除");
              }}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAuthor;
