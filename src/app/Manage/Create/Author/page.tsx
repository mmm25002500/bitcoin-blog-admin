'use client';

import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import ImagePreview from "@/components/Card/ImagePreview";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import UploadFile from "@/components/UploadFile/UploadFile";
import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';

const CreateAuthor = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    console.log("imageFile", imageFile);
  }
    , [imageFile]);

  // 處理路由變化
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col min-h-full gap-5 relative">
        {/* 表單區塊 */}
        <div className="flex-1 flex flex-col gap-5 grow">
          {/* 作者名稱 */}
          <div className="flex flex-col gap-2">
            <Label text="作者名稱" htmlFor="name" required className="mb-2" />
            <Input name="name" id="name" placeholder="請輸入標題" />
          </div>

          {/* 作者簡介 */}
          <div className="flex flex-col gap-2">
            <Label text="作者簡介" htmlFor="description" required className="mb-2" />
            <Input name="description" id="description" placeholder="請輸入作者簡介" />
          </div>

          {/* 作者頭貼 */}
          <div className="flex flex-col gap-0 grow w-[502px]">
            <Label text="作者頭貼" htmlFor="image" required />
            <span className="text-xs text-[#7C7C7C] mb-2">僅限上傳 .jpg、.png 檔案，比例為 1:1</span>

            <UploadFile
              previewUrl={imageFile ? URL.createObjectURL(imageFile) : ""}
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
        </div>

      </div>

      {/* 按鈕區塊 */}
      <div className="pt-20">
        <div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-end gap-2 pr-7">
            <CancelBtn label="取消" onClick={() => router.push("/Manage/Author")} />
            <AddBtn label="新增" onClick={() => router.push("/Manage/Author")} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAuthor;
