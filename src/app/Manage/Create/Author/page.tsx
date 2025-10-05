"use client";

import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import UploadFile from "@/components/UploadFile/UploadFile";
import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";

const CreateAuthor = () => {
	const [imageFile, setImageFile] = useState<File | null>(null); //image
	const [name, setName] = useState<string>(""); // name
	const [description, setDescription] = useState<string>(""); // description

	// useEffect(() => {
	// 	console.log("imageFile", imageFile);
	// 	console.log("name:", name);
	// 	console.log("description:", description);
	// }, [imageFile, name, description]);

	// 處理路由變化
	const router = useRouter();

	// 處理表單提交
	const handleSubmit = async () => {
		if (!imageFile || !name || !description) {
			alert("請填寫所有欄位");
			return;
		}

		const formData = new FormData();
		formData.append("fullname", name);
		formData.append("name", name);
		formData.append("description", description);
		formData.append("image", imageFile); // 已確保不為 null

		try {
			const res = await fetch("/api/author/addAuthor", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			const result = await res.json();
			if (result.success) {
				alert("新增成功");
				router.push("/Manage/Author");
			} else {
				console.error("新增失敗", result.error);
				// alert("新增失敗：" + result.error);
			}
		} catch (error) {
			console.error("提交表單錯誤：", error);
			// alert("發生錯誤，請稍後再試");
		}
	};

	return (
		<>
			<div className="flex flex-col min-h-full gap-5 relative">
				{/* 表單區塊 */}
				<div className="flex-1 flex flex-col gap-5 grow">
					{/* 作者名稱 */}
					<div className="flex flex-col gap-2">
						<Label text="作者名稱" htmlFor="name" required className="mb-2" />
						<Input
							name="name"
							id="name"
							placeholder="請輸入標題"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setName(e.target.value);
							}}
							value={name}
						/>
					</div>

					{/* 作者簡介 */}
					<div className="flex flex-col gap-2">
						<Label
							text="作者簡介"
							htmlFor="description"
							required
							className="mb-2"
						/>
						<Input
							name="description"
							id="description"
							placeholder="請輸入作者簡介"
							value={description}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setDescription(e.target.value);
							}}
						/>
					</div>

					{/* 作者頭貼 */}
					<div className="flex flex-col gap-0 grow w-[502px]">
						<Label text="作者頭貼" htmlFor="image" required />
						<span className="text-xs text-[#7C7C7C] mb-2">
							僅限上傳 .jpg、.png 檔案，比例為 1:1
						</span>

						<UploadFile
							previewUrl={imageFile ? URL.createObjectURL(imageFile) : ""}
							onChange={(file) => setImageFile(file)}
							onDrop={(file) => setImageFile(file)}
						/>
					</div>
				</div>
			</div>

			{/* 按鈕區塊 */}
			<div className="pt-20">
				<div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
					<div className="flex justify-end gap-2 pr-7">
						<CancelBtn
							label="取消"
							onClick={() => {
								router.push("/Manage/Author");
							}}
						/>
						<AddBtn
							label="新增"
							onClick={async () => {
								await handleSubmit();
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateAuthor;
