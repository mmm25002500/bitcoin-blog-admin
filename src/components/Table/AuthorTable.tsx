"use client";

import type { AuthorTableProps } from "@/types/Table/AuthorTable";
import type { AuthorData } from "@/types/Author/Author";
import { useMemo, useState } from "react";
import Image from "next/image";
import TrashCanIcon from "@/images/trash_can.svg";
import PenIcon from "@/images/pen.svg";
import RedTrashCanIcon from "@/images/red_trash_can.svg";
import NoResultIcon from "@/images/NoResult.svg";
import ConfirmModal from "../Modal/ConfirmModal";
import { useRouter } from "nextjs-toploader/app";

const AuthorTable = (props: AuthorTableProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(props.perPage || 10);
	const [sortBy, setSortBy] = useState<keyof AuthorData>("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [deleteID, setDeleteID] = useState<string>("");
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showDeleteThisConfirmModal, setShowDeleteThisConfirmModal] =
		useState(false);

	// 處理路由變化
	const router = useRouter();

	// 處理排序
	const handleSort = (field: keyof AuthorData) => {
		if (sortBy === field) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field);
			setSortDirection("asc");
		}
	};

	// 顯示排序箭頭
	const renderSortArrow = (field: keyof AuthorData) =>
		sortBy === field ? (sortDirection === "asc" ? " ▲" : " ▼") : "";

	// 篩選資料
	const filteredData = useMemo(() => {
		const keyword = props.searchValue?.toLowerCase() || "";
		return props.AuthorData.filter(
			(item) =>
				item.name.toLowerCase().includes(keyword) ||
				item.description.toLowerCase().includes(keyword),
		);
	}, [props.AuthorData, props.searchValue]);

	// 排序資料
	const sortedData = [...filteredData].sort((a, b) => {
		const valA = a[sortBy];
		const valB = b[sortBy];
		if (valA && valB) {
			if (valA < valB) return sortDirection === "asc" ? -1 : 1;
			if (valA > valB) return sortDirection === "asc" ? 1 : -1;
		}
		return 0;
	});

	// 分頁
	const paginatedData = sortedData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	// 計算總頁數
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	// 處理選取的項目
	const handleCheckboxChange = (id: string) => {
		setSelectedIds((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			console.log(newSet);
			return newSet;
		});
	};

	// 處理要刪除的項目
	const handleDeleteSelected = () => {
		const idsToDelete = Array.from(selectedIds);
		setShowConfirmModal(true);
		console.log("要刪除的 ID：", idsToDelete);
	};

	// 處理刪除當前項目
	const handleDeleteCurrent = (id: string) => {
		setShowDeleteThisConfirmModal(true);
		setDeleteID(id);
		console.log("刪除單一項目", id);
	};

	return (
		<div className="p-6">
			{selectedIds.size > 0 && (
				<div className="flex items-center justify-between mb-2 text-sm text-[#6B6B6B] font-medium leading-[22px]">
					<span>已選取 {selectedIds.size} 個項目</span>
					<button
						type="button"
						onClick={handleDeleteSelected}
						className="text-[#D82027] hover:text-red-800 leading-3.5 flex gap-1 items-center"
					>
						<Image
							src={RedTrashCanIcon}
							alt="login"
							width={100}
							height={100}
							className="w-4 h-4"
						/>
						刪除作者
					</button>
				</div>
			)}

			<div className="overflow-hidden rounded-lg">
				<table className="min-w-full bg-white">
					<thead className="bg-[#F9F9F9]">
						<tr>
							<th className="px-3 py-2"> </th>
							{[
								{ key: "name", label: "作者姓名" },
								{ key: "image", label: "作者頭像" },
								{ key: "postQuantity", label: "文章數量" },
								{ key: "description", label: "簡介" },
							].map(({ key, label }) => (
								<th
									key={key}
									className="px-3 py-2 text-left text-neutral-700 font-medium leading-[22px] text-sm cursor-pointer whitespace-nowrap"
								>
									<button
										type="button"
										onClick={() => handleSort(key as keyof AuthorData)}
									>
										{label}
										{renderSortArrow(key as keyof AuthorData)}
									</button>
								</th>
							))}
							<th className="px-3 py-2 text-left">操作</th>
						</tr>
					</thead>

					{paginatedData.length === 0 ? (
						<tbody>
							<tr>
								<td colSpan={6}>
									<div className="flex flex-col items-center justify-center h-[60vh] text-[#A7A7A7] text-sm">
										<Image
											src={NoResultIcon}
											alt="no result"
											width={100}
											height={100}
											className="mb-2"
										/>
										查無搜尋結果
									</div>
								</td>
							</tr>
						</tbody>
					) : (
						<tbody>
							{paginatedData.map((author) => (
								<tr
									key={author.id}
									className={`border-b-[1px] border-[#F1F1F1] text-sm leading-6 font-normal text-[#1A1A1A] ${
										selectedIds.has(author.id)
											? "bg-[#F3F6F7] border-[1px] border-[#F1F1F1]"
											: ""
									}`}
								>
									<td className="px-3 py-2">
										<div className="inline-flex items-center">
											<label className="flex items-center cursor-pointer relative">
												<input
													type="checkbox"
													checked={selectedIds.has(author.id)}
													onChange={() => handleCheckboxChange(author.id)}
													className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
													id="check"
												/>
												<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
													<svg
														role="img"
														aria-label="check"
														xmlns="http://www.w3.org/2000/svg"
														className="h-3.5 w-3.5"
														viewBox="0 0 20 20"
														fill="currentColor"
														stroke="currentColor"
														strokeWidth="1"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														>
															{" "}
														</path>
													</svg>
												</span>
											</label>
										</div>
									</td>
									<td className="px-3 py-2">{author.name}</td>
									<td className="px-3 py-2">
										<img
											src={author.image}
											alt={author.name}
											className="w-10 h-10 rounded-full object-cover"
										/>
									</td>
									<td className="px-3 py-2">{author.postQuantity} 則</td>
									<td className="px-3 py-2 max-w-[200px]">
										<p className="line-clamp-2">{author.description}</p>
									</td>
									<td className="px-3 py-2">
										<button
											type="button"
											onClick={() => handleDeleteCurrent(author.id)}
											className="mr-2 border-[1px] border-[#E9E9E9] rounded-sm p-2.5 bg-white"
										>
											<Image
												src={TrashCanIcon}
												alt="login"
												width={100}
												height={100}
												className="w-4 h-4"
											/>
										</button>
										<button
											type="button"
											onClick={() => router.push("/Manage/Edit/Author")}
											className="border-[1px] border-[#E9E9E9] rounded-sm p-2.5 bg-white"
										>
											<Image
												src={PenIcon}
												alt="login"
												width={100}
												height={100}
												className="w-4 h-4"
											/>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
			</div>

			{/* 分頁 */}
			<div className="flex items-center mt-4 gap-2">
				<p className="text-[#A7A7A7] font-normal text-sm leading-[22px]">
					顯示 {(currentPage - 1) * itemsPerPage + 1} -{" "}
					{Math.min(currentPage * itemsPerPage, filteredData.length)} 筆資料，共{" "}
					{filteredData.length} 筆
				</p>

				<select
					className="border-[1px] border-neutral-300 px-3 py-2 rounded-md"
					value={itemsPerPage}
					onChange={(e) => {
						setItemsPerPage(Number.parseInt(e.target.value));
						setCurrentPage(1);
					}}
				>
					{[5, 10, 15, 20, 50, 100].map((num) => (
						<option
							key={num}
							value={num}
							className="text-[#040404] font-normal text-sm leading-[22px]"
						>
							{num} 筆
						</option>
					))}
				</select>

				<div className="flex items-center ml-auto space-x-2">
					<button
						type="button"
						className="text-black disabled:text-[#A7A7A7]"
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
					>
						{"<"}
					</button>
					<span className="text-[505050] font-normal text-sm leading-[22px] border-[1px] border-neutral-200 rounded-sm px-3 py-[5px]">
						{currentPage}
					</span>
					<span className="text-[#7C7C7C] font-normal text-sm leading-6">
						/
					</span>
					<span className="text-[#7C7C7C] font-normal text-sm leading-[22px]">
						{totalPages}
					</span>
					<button
						type="button"
						className="text-black disabled:text-[#A7A7A7]"
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
					>
						{">"}
					</button>
				</div>
			</div>

			{/* Modal */}
			<ConfirmModal
				isOpen={showConfirmModal}
				title={`確定要刪除這 ${selectedIds.size} 位作者嗎？`}
				description="此操作將永久刪除作者，且無法復原。請確認是否執行。"
				confirmLabel="刪除作者"
				cancelLabel="取消"
				onConfirm={() => {
					props.onDelete?.(Array.from(selectedIds));
					setSelectedIds(new Set());
					setShowConfirmModal(false);
				}}
				onCancel={() => setShowConfirmModal(false)}
			/>

			<ConfirmModal
				isOpen={showDeleteThisConfirmModal}
				title="確定要刪除這位作者嗎？"
				description="此操作將永久刪除作者，且無法復原。請確認是否執行。"
				confirmLabel="刪除作者"
				cancelLabel="取消"
				onConfirm={() => {
					props.onDelete?.([deleteID]);
					setShowDeleteThisConfirmModal(false);
				}}
				onCancel={() => setShowDeleteThisConfirmModal(false)}
			/>
		</div>
	);
};

export default AuthorTable;
