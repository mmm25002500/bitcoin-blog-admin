"use client";
import { PostData, PostTableProps } from "@/types/Table/PostTable";
import { useState } from "react";

const PostTable = (props: PostTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(props.perPage || 10);
  const [sortBy, setSortBy] = useState<keyof PostData>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(props.PostData.length / itemsPerPage);

  // 處理排序
  const handleSort = (field: keyof PostData) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // 排序和分頁
  const sortedData = [...props.PostData].sort((a, b) => {
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

  // 渲染排序箭頭
  const renderSortArrow = (field: keyof PostData) =>
    sortBy === field ? (sortDirection === "asc" ? " ▲" : " ▼") : "";

  // 處理每頁顯示數量的變化
  const handleChangeItemsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // 重設回第一頁
  };

  return (
    <div className="p-6">
      <div className="overflow-hidden rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-[#F9F9F9]">
            <tr>
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
          <tbody>
            {paginatedData.map((post, index) => (
              <tr key={index} className="border-b-[1px] border-[#F1F1F1] text-sm leading-6 font-normal text-[#1A1A1A]">
                <td className="px-3 py-2">{post.id}</td>
                <td className="px-3 py-2 max-w-[250px]">
                  <p className="line-clamp-2">{post.title}</p>
                </td>
                <td className="px-3 py-2">{post.author}</td>
                <td className="px-3 py-2">{post.date}</td>
                <td className="px-3 py-2">
                  <span className="px-3 py-[2px] bg-[#F1F1F1] text-[#505050] font-normal leading-6 rounded-full text-sm">{post.tag}</span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${post.type === "News"
                        ? "bg-[#ECF6FF] rounded-full px-3 py-[2px] text-[#1A72C2] text-sm font-normal leading-6"
                        : "bg-[#EBFAEB] rounded-full px-3 py-[2px] text-[#3FA02D] text-sm font-normal leading-6"
                      }`}
                  >
                    {post.type}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button className="text-blue-500 mr-2 hover:underline">編輯</button>
                  <button className="text-red-500 hover:underline">刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分頁控制區塊 */}
      <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
        <p>
          顯示 {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, props.PostData.length)} 筆資料，共{" "}
          {props.PostData.length} 筆
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="perPage">每頁顯示</label>
          <select
            id="perPage"
            className="border px-2 py-1 rounded"
            value={itemsPerPage}
            onChange={handleChangeItemsPerPage}
          >
            {[5, 10, 15, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostTable;
