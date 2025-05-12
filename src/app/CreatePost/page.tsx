'use client';
import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import LayoutIndex from "@/components/Layout/LayoutIndex";
import UploadFile from "@/components/UploadFile/UploadFile";

// icon
import NewsIcon from "@/images/news_icon.svg";
import { useEffect, useState } from "react";

const CreatePost = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    console.log("imageFile", imageFile);
  }
    , [imageFile]);

  return (
    <LayoutIndex title="新增文章" logo={NewsIcon}>
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

          <div className="flex">
            {/* 標籤 */}
            <div className="flex flex-col gap-2 grow">
              <Label
                text={"標籤"}
                htmlFor={"tag"}
                required={true}
                className={"mb-2"}
              />
            </div>

            {/* 類型 */}
            <div className="flex flex-col gap-2">
              <Label
                text={"類型"}
                htmlFor={"type"}
                required={true}
                className={"mb-2"}
              />
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
          </div>

          {/* 封面圖 */}
          <div className="flex flex-col gap-0 grow w-[502px]">
            <Label text="封面圖上傳" htmlFor="image" required />
            <span className="text-xs text-[#7C7C7C] mb-2">僅限上傳 .jpg、.png 檔案</span>

            <UploadFile
              onChange={(file) => setImageFile(file)}
              onDrop={(file) => setImageFile(file)}
            />

            <span className="text-xs text-[#7C7C7C] mt-2">上傳張數 {imageFile ? 1 : 0}/1</span>
          </div>
        </div>

        {/* 確定按鈕置底 */}
        <div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-end gap-2">
            <AddBtn label="發佈" onClick={() => console.log("發佈")} />
            <CancelBtn label="取消" onClick={() => console.log("取消")} />
          </div>
        </div>
      </div>
    </LayoutIndex>
  );
}

export default CreatePost;