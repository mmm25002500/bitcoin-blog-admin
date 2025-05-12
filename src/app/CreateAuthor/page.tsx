'use client';
import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import LayoutIndex from "@/components/Layout/LayoutIndex";

// icon
import NewsIcon from "@/images/news_icon.svg";

const CreateAuthor = () => {
  return (
    <LayoutIndex title="新增作者" logo={NewsIcon}>
      <div className="flex flex-col h-full gap-5">
        {/* 表單區塊 */}
        <div className="flex-1 flex flex-col gap-5">
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
          <div className="flex flex-col gap-0 grow">
            <Label text="作者頭貼" htmlFor="image" required />
            <span className="text-xs text-[#7C7C7C] mb-2">僅限上傳 .jpg、.png 檔案，比例為 1:1</span>
            <div className="outline-dashed outline-[#575757] outline-[1px] rounded-md p-10">
              拖曳你的檔案開始上傳
            </div>
            <span className="text-xs text-[#7C7C7C] mt-2">上傳張數 0/1</span>
          </div>
        </div>

        {/* 確定按鈕置底 */}
        <div className="pt-4 text-right relative">
          <div className="absolute top-0 left-0 w-full h-3 z-10 shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.1)]"></div>
          <div className="flex gap-2 flex-row-reverse">
            <AddBtn label={"確定"} onClick={() => console.log()} />
            <CancelBtn label={"取消"} onClick={() => console.log()} />
          </div>
        </div>
      </div>
    </LayoutIndex>

  );
}

export default CreateAuthor;