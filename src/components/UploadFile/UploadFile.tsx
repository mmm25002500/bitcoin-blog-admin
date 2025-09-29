import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { UploadFileProps } from "@/types/Upload/Upload";

// icon
import UploadIcon from "@/images/upload.svg";
import BrowserFileBtn from "../Button/BrowserFileBtn";
import ImagePreview from "../Card/ImagePreview";

const UploadFile = (props: UploadFileProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		props.previewUrl || null,
	);
	const [imageFile, setImageFile] = useState<File | null>(null);

	useEffect(() => {
		setPreviewUrl(props.previewUrl || null);
	}, [props.previewUrl]);

	// 處理檔案選擇
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file?.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewUrl(reader.result as string);
				props.onChange?.(file);
				setImageFile(file);
			};
			reader.readAsDataURL(file);
		}
	};

	// 處理拖曳上傳
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file?.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewUrl(reader.result as string);
				props.onDrop?.(file);
				setImageFile(file);
			};
			reader.readAsDataURL(file);
		}
	};

	// 處理點擊上傳
	const handleClick = () => {
		props.onClick?.();
		fileInputRef.current?.click();
	};

	return (
		<div>
			<div
				className={`outline-dashed outline-[#575757] outline-[1px] rounded-md text-center cursor-pointer ${previewUrl ? "" : "p-10"}`}
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
			>
				{previewUrl ? (
					<Image
						src={previewUrl}
						alt="預覽圖"
						width={120}
						height={120}
						className="mx-auto object-cover w-full h-full"
					/>
				) : (
					<div>
						<Image
							src={UploadIcon}
							alt="上傳圖示"
							width={42}
							height={42}
							className="mx-auto w-11 h-11 mb-2"
						/>
						<span className="text-[#0B0B0B] text-sm font-normal leading-[22px]">
							拖曳你的檔案開始上傳
						</span>
						<div className="flex items-center my-6">
							<div className="flex-grow h-px bg-neutral-300" />
							<span className="mx-4 text-sm text-neutral-500">OR</span>
							<div className="flex-grow h-px bg-neutral-300" />
						</div>
						<BrowserFileBtn onClick={handleClick} label="選擇檔案" className="" />
					</div>
				)}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleFileChange}
				/>
			</div>

			{/* 上傳張數 */}
			<span className="text-xs text-[#7C7C7C] mt-2">
				上傳張數 {imageFile || previewUrl ? 1 : 0}/1
			</span>

			{/* 圖片預覽 */}
			{(imageFile || previewUrl) && (
				<ImagePreview
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					imageFile={imageFile ?? previewUrl!} // 可以是 File 或 URL
					onDelete={() => {
						setImageFile(null);
						setPreviewUrl(null);
					}}
				/>
			)}

		</div>
	);
};

export default UploadFile;
