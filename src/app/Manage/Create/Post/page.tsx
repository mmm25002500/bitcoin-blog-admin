"use client";

import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import ImagePreview from "@/components/Card/ImagePreview";
import DateSelection from "@/components/Input/DateSelection";
// import DropDown from "@/components/Input/DropDown";
import DropDownTag from "@/components/Input/DropDownTag";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import UploadFile from "@/components/UploadFile/UploadFile";

import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import MarkdownEditor from "@/components/Markdown/MarkdownEditor";
import DropDown from "@/components/Input/DropDown";
import type { AuthorData } from "@/types/Author/Author";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

// TODO：
// 1. content to filename.md and set filename to supabase

const CreatePost = () => {
  // const [selectedOption, setSelectedOption] = useState<string>("All");
  const [authorOption, setAuthorOption] = useState<AuthorData[]>([]);

  const searchParams = useSearchParams();
  const author_id = searchParams.get("author_id");

  // 使用者輸入
  const [title, setTitle] = useState<string>(""); // title
  const [description, setDescription] = useState<string>(""); // description
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // tags
  const [selectedType, setSelectedType] = useState<string[]>([]); // type
  const [seletedAuthor, setSelectedAuthor] = useState<AuthorData>(); // author
  const [imageFile, setImageFile] = useState<File | null>(null); // image
  const [date, setDate] = useState<Date | undefined>(undefined); // date
  const [tagOptions, setTagOptions] = useState<string[]>([]);	// all tags
  const [typeOptions, setTypeOptions] = useState<string[]>([]);	// all types

  useEffect(() => {
    console.log("title:", title);
    console.log("description:", description);
    console.log("selectedTags:", selectedTags);
    console.log("selectedType:", selectedType);
    console.log("selectedAuthor:", seletedAuthor);
    console.log("imageFile:", imageFile);
    console.log("date:", date);
  }, [
    title,
    description,
    selectedTags,
    selectedType,
    seletedAuthor,
    imageFile,
    date,
  ]);

  // 處理路由變化
  const router = useRouter();

  // const ArticleType = [
  //   'News',
  //   'Post'
  // ];

  // 作者資料擷取
  const fetchAuthors = useCallback(async () => {
    const res = await fetch("/api/author/getAuthor");
    const result = await res.json();

    if (result.success) {
      setAuthorOption(result.data);

      // 如果有帶 author_id，直接找出該作者
      if (author_id) {
        const matched = result.data.find((author: AuthorData) => author.id === author_id);
        if (matched) {
          setSelectedAuthor(matched);
        }
      }
    } else {
      console.error("取得失敗：", result.error);
    }
  }, [author_id]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // 處理日期選擇的取消按鈕點擊事件
  const handleDateCancel = () => {
    setDate(undefined);
    console.log("日期選擇取消");
  };

  // 處理日期選擇的變化
  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    // console.log(`選擇的日期: ${selected}`);
  };

  // 處理下拉選單的選擇
  // const handleSelect = (option: string) => {
  //   setSelectedOption(option);
  //   console.log(`選擇的文章類型: ${option}`);
  // };

  // // 處理取消按鈕的點擊事件
  // const handleDropDownCancel = () => {
  //   setSelectedOption("All");
  // }

  const handleSubmit = async () => {
    if (!title || !description || !imageFile || !seletedAuthor) {
      alert("請填寫完整欄位");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(selectedTags)); // <-- 傳 JSON 字串
    formData.append("type", JSON.stringify(selectedType)); // <-- 傳 JSON 字串
    formData.append("image", imageFile);
    formData.append("filename", imageFile.name); // 原始檔名
    formData.append("author_id", seletedAuthor.id); // 作者 ID

    const res = await fetch("/api/Post/addPost", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      alert("文章新增成功！");
      router.push("/Manage/Post");
    } else {
      console.log("新增失敗：", result.error);
    }
  };

  // 標籤資料擷取
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags/Posts/getTags");
        const result = await res.json();

        if (result.success) {
          setTagOptions(result.tags); // 設定下拉選單
        } else {
          console.error("取得標籤失敗：", result.error);
        }
      } catch (err) {
        console.error("標籤 API 錯誤：", err);
      }
    };

    fetchTags();
  }, []);

  // 類型資料擷取
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/types/Posts/getTypes");
        const result = await res.json();

        if (result.success) {
          setTypeOptions(result.types); // 設定下拉選單
        } else {
          console.error("取得類型失敗：", result.error);
        }
      } catch (err) {
        console.error("類型 API 錯誤：", err);
      }
    };

    fetchTypes();
  }, []);

  return (
    <>
      <div className="flex flex-col h-full gap-5">
        {/* 表單區塊 */}
        <div className="flex-1 flex flex-col gap-5">
          {/* 標題 */}
          <div className="flex flex-col gap-2">
            <Label
              text={"標題"}
              htmlFor={"title"}
              required={true}
              className={"mb-2"}
            />
            <Input
              name={"title"}
              id={"title"}
              placeholder={"請輸入標題"}
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          {/* 文章描述 */}
          <div className="flex flex-col gap-2">
            <Label
              text={"文章描述"}
              htmlFor={"description"}
              required={true}
              className={"mb-2"}
            />
            <Input
              name={"description"}
              id={"description"}
              placeholder={"請輸入文章描述"}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          {/* 作者 */}
          <div className="flex flex-col gap-2">
            <Label
              text={"作者"}
              htmlFor={"author"}
              required={true}
              className={"mb-2"}
            />

            <DropDown
              options={authorOption.map((author) => author.name)}
              selectedOption={seletedAuthor?.name || ""}
              label_name={"請選擇作者"}
              onSelect={(option: string) =>
                setSelectedAuthor(authorOption.find((author) => author.name === option))
              }
              onCancel={() => setSelectedAuthor(undefined)}
            />
            {/* <Input name={"author"} id={"author"} placeholder={"請輸入作者"} /> */}
          </div>

          <div className="flex gap-5">
            {/* 標籤 */}
            <div className="flex flex-col gap-2 w-full">
              <Label
                text={"標籤"}
                htmlFor={"tag"}
                required={true}
                className={"mb-2"}
              />
              <div>
                {/* 這一個可能是「國際、台灣、比特幣、技術...」，非 Post、News 系統 */}
                {/* 因此改為像是Tag一樣 */}
                <DropDownTag
                  options={tagOptions}
                  selectedOptions={selectedTags}
                  onChange={setSelectedTags}
                />
              </div>
            </div>

            {/* 類型 */}
            <div className="flex flex-col gap-2 w-full">
              <Label
                text={"類型"}
                htmlFor={"type"}
                required={true}
                className={"mb-2"}
              />

              <div>
                <DropDownTag
                  options={typeOptions}
                  selectedOptions={selectedType}
                  onChange={setSelectedType}
                />
              </div>
            </div>
          </div>

          {/* 日期 */}
          <div className="flex flex-col gap-2">
            <Label
              text={"日期"}
              htmlFor={"date"}
              required={true}
              className={"mb-2"}
            />
            <div>
              <DateSelection
                selected={date}
                onSelect={handleDateSelect}
                onCancel={handleDateCancel}
              />
            </div>
          </div>

          {/* 封面圖 */}
          <div className="flex flex-col gap-0 grow w-[502px]">
            <Label text="封面圖上傳" htmlFor="image" required />
            <span className="text-xs text-[#7C7C7C] mb-2">
              僅限上傳 .jpg、.png 檔案
            </span>

            <UploadFile
              onChange={(file) => setImageFile(file)}
              onDrop={(file) => setImageFile(file)}
            />

            {/* 上傳張數 */}
            {!imageFile && (
              <span className="text-xs text-[#7C7C7C] mt-2">
                上傳張數 {imageFile ? 1 : 0}/1
              </span>
            )}

            {/* 圖片預覽 */}
            {imageFile && (
              <ImagePreview
                imageFile={imageFile}
                onDelete={() => setImageFile(null)}
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              text={"文章內容"}
              htmlFor={"date"}
              required={false}
              className={"mb-2"}
            />
            <div>
              <MarkdownEditor />
            </div>
          </div>
        </div>

        {/* 確定按鈕置底 */}
        <div className="pt-20">
          <div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
            <div className="flex justify-end gap-2 pr-7">
              <CancelBtn
                label="取消"
                onClick={() => router.push("/Manage/Post")}
              />
              <AddBtn label="發佈" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
