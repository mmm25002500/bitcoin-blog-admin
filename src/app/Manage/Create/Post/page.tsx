'use client';

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
import { useRouter } from 'nextjs-toploader/app';
import MarkdownEditor from "@/components/Markdown/MarkdownEditor";

const CreatePost = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  // const [selectedOption, setSelectedOption] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  // 處理路由變化
  const router = useRouter();

  // const ArticleType = [
  //   'News',
  //   'Post'
  // ];

  // 日期選擇的值
  const [date, setDate] = useState<Date | undefined>(undefined);
  console.log("date", date);

  useEffect(() => {
    console.log("imageFile", imageFile);
  }, [imageFile]);

  // useEffect(() => {
  //   if (selectedOption) {
  //     console.log(`真正選到的文章類型: ${selectedOption}`);
  //   }
  // }, [selectedOption]);

  // 處理日期選擇的取消按鈕點擊事件
  const handleDateCancel = () => {
    setDate(undefined);
    console.log("日期選擇取消");
  };

  // 處理日期選擇的變化
  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    console.log(`選擇的日期: ${selected}`);
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
            <Input
              name={"author"}
              id={"author"}
              placeholder={"請輸入作者"}
            />
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
                  options={["tag1", "tag2", "tag3"]}
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
                  options={["類型1", "類型2", "類型3"]}
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
            <span className="text-xs text-[#7C7C7C] mb-2">僅限上傳 .jpg、.png 檔案</span>

            <UploadFile
              onChange={(file) => setImageFile(file)}
              onDrop={(file) => setImageFile(file)}
            />

            {/* 上傳張數 */}
            {
              !imageFile && (
                <span className="text-xs text-[#7C7C7C] mt-2">上傳張數 {imageFile ? 1 : 0}/1</span>
              )
            }

            {/* 圖片預覽 */}
            {
              imageFile && (
                <ImagePreview
                  imageFile={imageFile}
                  onDelete={() => setImageFile(null)}
                />
              )
            }
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
              <CancelBtn label="取消" onClick={() => router.push("/Manage/Post")} />
              <AddBtn label="發佈" onClick={() => router.push("/Manage/Post")} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
