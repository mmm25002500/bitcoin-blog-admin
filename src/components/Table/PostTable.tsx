"use client";
import { PostData, PostTableProps } from "@/types/Table/PostTable";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'nextjs-toploader/app';

// icon
import TrashCanIcon from "@/images/trash_can.svg";
import PenIcon from "@/images/pen.svg";
import RedTrashCanIcon from "@/images/red_trash_can.svg";
import ConfirmModal from "../Modal/ConfirmModal";
import NoResultIcon from "@/images/NoResult.svg";

const PostTable = (props: PostTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(props.perPage || 10);
  const [sortBy, setSortBy] = useState<keyof PostData>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteThisConfirmModal, setShowDeleteThisConfirmModal] = useState(false);

  const totalPages = Math.ceil(props.PostData.length / itemsPerPage);

  // 處理路由變化
  const router = useRouter();

  // 處理排序
  const handleSort = (field: keyof PostData) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // 處理搜尋、Type、日期
  const filteredData = props.PostData.filter((post) => {
    const keyword = props.searchValue?.toLowerCase() || "";
    const matchesSearch =
      post.title.toLowerCase().includes(keyword) ||
      post.id.toLowerCase().includes(keyword) ||
      post.author.toLowerCase().includes(keyword);

    const matchesType = !props.type || props.type === "All" || post.type === props.type;

    const postDate = new Date(post.date);
    const from = props.date?.from;
    const to = props.date?.to ? new Date(props.date.to.setHours(23, 59, 59, 999)) : undefined;

    const matchesDate =
      !from && !to ? true :
        from && to ? postDate >= from && postDate <= to :
          from ? postDate >= from :
            to ? postDate <= to : true;

    return matchesSearch && matchesType && matchesDate;
  });


  // 處理排序
  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // 分頁
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 排序 title
  const renderSortArrow = (field: keyof PostData) =>
    sortBy === field ? (sortDirection === "asc" ? " ▲" : " ▼") : "";

  // 處理切換頁面
  const handleChangeItemsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // 處理選取項目
  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };


  // 處理全選
  // const isAllCurrentPageSelected = paginatedData.every((item) => selectedIds.has(item.id));
  // const handleSelectAll = () => {
  //   setSelectedIds((prev) => {
  //     const newSet = new Set(prev);
  //     if (isAllCurrentPageSelected) {
  //       paginatedData.forEach((item) => newSet.delete(item.id));
  //     } else {
  //       paginatedData.forEach((item) => newSet.add(item.id));
  //     }
  //     return newSet;
  //   });
  // };

  // 處理要刪除的項目
  const handleDeleteSelected = () => {
    const idsToDelete = Array.from(selectedIds);
    setShowConfirmModal(true);
    console.log("要刪除的 ID：", idsToDelete);
    props.onDelete?.(idsToDelete);

    // TODO: 串接 API 或透過 props 回傳資料
    // props.onDelete?.(idsToDelete);a
  };

  // 處理刪除當前項目
  const handleDeleteCurrent = (id: string) => {
    setShowDeleteThisConfirmModal(true);
    console.log("要刪除的 ID：", id);
    props.onDelete?.([id]);
  };

  return (
    <div className="p-6">
      {/* 選取狀態顯示 */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between mb-2 text-sm text-[#6B6B6B] font-medium leading-[22px]">
          <span>已選取 {selectedIds.size} 個項目</span>
          <button
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
            刪除文章
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-[#F9F9F9]">
            <tr>
              <th className="px-3 py-2 text-left">
                {/* <div className="inline-flex items-center">
                  <label className="flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAll}
                      className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check" />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                </div> */}
              </th>
              {[
                { key: "id", label: "ID" },
                { key: "title", label: "標題" },
                { key: "author", label: "作者" },
                { key: "date", label: "發布日期" },
                { key: "tag", label: "標籤" },
                { key: "type", label: "類型" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-3 py-2 text-left text-neutral-700 font-medium leading-[22px] text-sm cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort(key as keyof PostData)}
                >
                  {label}
                  {renderSortArrow(key as keyof PostData)}
                </th>
              ))}
              <th className="px-3 py-2 text-left">操作</th>
            </tr>
          </thead>
          {paginatedData.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={8}>
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
              {paginatedData.map((post, index) => (
                <tr
                  key={index}
                  className={`border-b-[1px] border-[#F1F1F1] text-sm leading-6 font-normal text-[#1A1A1A] ${selectedIds.has(post.id) ? "bg-[#F3F6F7] border-[1px] border-[#F1F1F1]" : ""
                    }`}
                >
                  <td className="px-3 py-2">
                    <div className="inline-flex items-center">
                      <label className="flex items-center cursor-pointer relative">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(post.id)}
                          onChange={() => handleCheckboxChange(post.id)}
                          className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check" />
                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                      </label>
                    </div>
                  </td>
                  <td className="px-3 py-2">{post.id}</td>
                  <td className="px-3 py-2 max-w-[250px]">
                    <p className="line-clamp-2">{post.title}</p>
                  </td>
                  <td className="px-3 py-2">{post.author}</td>
                  <td className="px-3 py-2">{post.date}</td>
                  <td className="px-3 py-2">
                    {
                      post.tag.map((tag, index) => (
                        index < 2 &&
                        <span key={index} className="px-3 py-[2px] bg-[#F1F1F1] text-[#505050] font-normal leading-6 rounded-full text-sm mr-2">
                          {tag}
                        </span>
                      ))
                    }
                  </td>
                  {/* 這一欄不一定是 News 或是 Post，可能會是比特幣、台灣、國際、技術... */}
                  <td className="px-3 py-2">
                    <span
                      className={`text-sm bg-gray-100 rounded-full px-3 py-[2px] font-normal leading-6`}
                    >
                      {post.type}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => handleDeleteCurrent(post.id)} className="mr-2 border-[1px] border-[#E9E9E9] rounded-sm p-2.5 bg-white">
                      <Image
                        src={TrashCanIcon}
                        alt="login"
                        width={100}
                        height={100}
                        className="w-4 h-4"
                      />
                    </button>
                    <button onClick={() => router.push("/Manage/Edit/Post")} className="border-[1px] border-[#E9E9E9] rounded-sm p-2.5 bg-white">
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

      {/* 分頁控制區塊 */}
      <div className="flex items-center mt-4 gap-2">
        <p className="text-[#A7A7A7] font-normal text-sm leading-[22px]">
          顯示 {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, props.PostData.length)} 筆資料，共{" "}
          {props.PostData.length} 筆，每頁顯示
        </p>

        <div className="flex items-center gap-2 grow">
          {/* <label htmlFor="perPage" className="text-[#A7A7A7] font-normal text-sm leading-[22px]">，每頁顯示</label> */}
          <select
            id="perPage"
            className="border-[1px] border-neutral-300 px-3 py-2 rounded-md"
            value={itemsPerPage}
            onChange={handleChangeItemsPerPage}
          >
            {[5, 10, 15, 20, 50, 100].map((num) => (
              <option key={num} value={num} className="text-[#040404] font-normal text-sm leading-[22px]">
                {num} 筆
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
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
            className="text-black disabled:text-[#A7A7A7]"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* 刪除確認視窗 */}
      <div className="w-80">
        <ConfirmModal
          isOpen={showConfirmModal}
          title={`確定要刪除這 ${selectedIds.size} 篇文章嗎？`}
          description={`此操作將永久刪除文章，且無法復原。\n確認是否繼續執行。`}
          confirmLabel="刪除文章"
          cancelLabel="取消"
          onConfirm={() => {
            handleDeleteSelected();
            setShowConfirmModal(false);
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      </div>

      <div className="w-80">
        <ConfirmModal
          isOpen={showDeleteThisConfirmModal}
          title={`確定要刪除這篇文章嗎？`}
          description={`此操作將永久刪除文章，且無法復原。\n確認是否繼續執行。`}
          confirmLabel="刪除文章"
          cancelLabel="取消"
          onConfirm={() => {
            setShowDeleteThisConfirmModal(false);
          }}
          onCancel={() => setShowDeleteThisConfirmModal(false)}
        />
      </div>
    </div>
  );
};

export default PostTable;
