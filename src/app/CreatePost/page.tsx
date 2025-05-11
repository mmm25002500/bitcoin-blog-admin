import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import LayoutIndex from "@/components/Layout/LayoutIndex";

// icon
import NewsIcon from "@/images/news_icon.svg";

const NewsManage = () => {
  return (
    <LayoutIndex title="新增文章" logo={NewsIcon}>
      <div className="flex flex-col gap-5">
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
    </LayoutIndex>
  );
}

export default NewsManage;