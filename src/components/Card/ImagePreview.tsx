import type { ImagePreviewProps } from "@/types/Card/ImagePreview";
import Image from "next/image";

// icon
import DeleteIcon from "@/images/x.svg";
// import ReflashIcon from "@/images/refrash.svg";

const ImagePreview = (props: ImagePreviewProps) => {
	let fileName = "";
	let fileSizeMB = "";
	let previewSrc = "";

	if (props.imageFile instanceof File) {
		fileName = props.imageFile.name;
		fileSizeMB = `${(props.imageFile.size / (1024 * 1024)).toFixed(2)} MB`;
		previewSrc = URL.createObjectURL(props.imageFile);
	} else {
		// 字串 URL
		fileName = props.imageFile.split("/").pop() || "image";
		fileSizeMB = ""; // URL 沒辦法直接知道大小，必要的話要再 fetch
		previewSrc = props.imageFile;
	}

	return (
		<div className="mt-2 w-full border-[1px] border-[#E7E7E7] rounded-md flex items-center p-4">
			{/* 左邊 */}
			<div className="grow flex gap-2">
				{/* 圖片 */}
				<div>
					<Image
						src={previewSrc}
						alt="preview"
						width={100}
						height={100}
						className="w-[60px] h-[60px] object-cover rounded-sm"
					/>
				</div>

				{/* 文字 */}
				<div className="flex flex-col gap-2">
					<span className="text-base font-semibold text-[#0B0B0B]">
						{fileName}
					</span>
					{fileSizeMB && (
						<span className="text-base text-[#6D6D6D]">{fileSizeMB}</span>
					)}
				</div>
			</div>

			{/* 右邊：刪除 */}
			<div className="flex gap-4">
				<button type="button" onClick={props.onDelete}>
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
