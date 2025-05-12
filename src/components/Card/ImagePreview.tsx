import { ImagePreviewProps } from "@/types/Card/ImagePreview";
import Image from "next/image";

// icon
import DeleteIcon from "@/images/x.svg";
// import ReflashIcon from "@/images/refrash.svg";

const ImagePreview = (props: ImagePreviewProps) => {
  // 檔案名稱與大小
  const fileName = props.imageFile.name;
  const fileSizeMB = (props.imageFile.size / (1024 * 1024)).toFixed(2); // MB 格式

  const handleDelete = () => {
    props.onDelete();
  };

  return (
    <div className="mt-2 w-full border-[1px] border-[#E7E7E7] rounded-md flex items-center p-4">
      {/* 左邊 */}
      <div className="grow flex gap-2">
        {/* 圖片 */}
        <div>
          <Image
            src={URL.createObjectURL(props.imageFile)}
            alt="preview"
            width={100}
            height={100}
            className="w-[60px] h-[60px] object-cover rounded-sm"
          />
        </div>

        {/* 文字 */}
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold text-[#0B0B0B]">{fileName}</span>
          <span className="text-base text-[#6D6D6D]">{fileSizeMB} MB</span>
        </div>
      </div>

      {/* 右邊：可加入刪除按鈕等 */}
      <div className="flex gap-4">
        {/* Reflash */}
        {/* <button className="">
          <Image
            src={ReflashIcon}
            alt="Reflash"
            width={100}
            height={100}
            className="w-6 h-6 object-cover rounded-sm"
          />
        </button> */}

        {/* Delete */}
        <button onClick={handleDelete}>
          <Image
            src={DeleteIcon}
            alt="Delete"
            width={100}
            height={100}
            className="w-6 h-6 object-cover rounded-sm"
          />
        </button>

      </div>
    </div>
  );
};

export default ImagePreview;
