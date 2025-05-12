'use client';
import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import LayoutIndex from "@/components/Layout/LayoutIndex";

// icon
import NewsIcon from "@/images/news_icon.svg";

const CreatePost = () => {
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
        </div>

        {/* 確定按鈕置底 */}
        <div className="pt-4 text-right relative">
          <div className="absolute top-0 left-0 w-full h-3 z-10 shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.1)]"></div>
          <div className="flex gap-2 flex-row-reverse">
            <AddBtn label={"發佈"} onClick={() => console.log()} />
            <CancelBtn label={"取消"} onClick={() => console.log()} />
          </div>
        </div>
      </div>
    </LayoutIndex>
  );
}

export default CreatePost;