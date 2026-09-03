"use client";

import { useCallback, useEffect, useState } from "react";
import AddBtn from "@/components/Button/AddBtn";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import type {
  MoreInfoCategory,
  MoreInfoPostOption,
} from "@/types/MoreInfo/MoreInfo";

const emptyCategory = (sortOrder: number): MoreInfoCategory => ({
  label: "",
  title: "",
  folder: "KnowBTC",
  sort_order: sortOrder,
  posts: [],
});

// 陣列元素上下移動
const move = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const MoreInfoManage = () => {
  const [categories, setCategories] = useState<MoreInfoCategory[]>([]);
  const [postOptions, setPostOptions] = useState<MoreInfoPostOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 目錄分類
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/moreInfo/getCategories");
      const result = await res.json();

      if (result.success) {
        setCategories(
          (result.data || []).map(
            (category: MoreInfoCategory & { label: string | null }) => ({
              id: category.id,
              label: category.label || "",
              title: category.title,
              folder: category.folder || "KnowBTC",
              sort_order: category.sort_order,
              posts: Array.isArray(category.posts) ? category.posts : [],
            }),
          ),
        );
      } else {
        console.error("取得目錄失敗：", result.error);
        alert(`取得目錄失敗：${result.error}`);
      }
    } catch (err) {
      console.error("目錄 API 錯誤：", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 可選的文章（moreBTC 走 Post）
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/Post/getPosts");
      const result = await res.json();

      if (result.success) {
        setPostOptions(
          (result.data || [])
            .filter((post: { filename?: string }) => post.filename)
            .map((post: { id: number; title: string; filename: string }) => ({
              id: post.id,
              title: post.title,
              // 前台用不含 .md 的檔名當網址
              filename: post.filename.replace(/\.md$/, ""),
            })),
        );
      } else {
        console.error("取得文章失敗：", result.error);
      }
    } catch (err) {
      console.error("文章 API 錯誤：", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [fetchCategories, fetchPosts]);

  const updateCategory = (index: number, patch: Partial<MoreInfoCategory>) => {
    setCategories((prev) =>
      prev.map((category, i) =>
        i === index ? { ...category, ...patch } : category,
      ),
    );
  };

  const handleSave = async () => {
    for (let i = 0; i < categories.length; i++) {
      if (!categories[i].title.trim()) {
        alert(`第 ${i + 1} 個分類請填寫標題`);
        return;
      }
    }

    setSaving(true);

    try {
      const res = await fetch("/api/moreInfo/saveCategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });

      const result = await res.json();

      if (result.success) {
        alert("目錄已儲存！");
        await fetchCategories();
      } else {
        console.error("儲存失敗：", result.error);
        alert(`儲存失敗：${result.error}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-[#7C7C7C]">載入中…</div>;
  }

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex-1 flex flex-col gap-5">
        <p className="text-sm text-[#7C7C7C]">
          這裡的分類與文章順序，就是前台 moreBTC 頁面左側目錄的顯示順序。
        </p>

        {categories.length === 0 && (
          <p className="text-sm text-[#7C7C7C]">目前沒有分類，按下方新增。</p>
        )}

        {categories.map((category, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: 順序即身分，新增的分類還沒有 id
            key={index}
            className="border-[1px] border-neutral-200 rounded-md p-4 flex flex-col gap-4"
          >
            {/* 分類標頭 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-800">
                分類 {index + 1}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() =>
                    setCategories(move(categories, index, index - 1))
                  }
                  className="text-sm text-[#0E0E0E] hover:underline disabled:opacity-30 disabled:no-underline"
                >
                  上移
                </button>
                <button
                  type="button"
                  disabled={index === categories.length - 1}
                  onClick={() =>
                    setCategories(move(categories, index, index + 1))
                  }
                  className="text-sm text-[#0E0E0E] hover:underline disabled:opacity-30 disabled:no-underline"
                >
                  下移
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm(`確定要刪除分類「${category.title}」嗎？`))
                      return;
                    setCategories(categories.filter((_, i) => i !== index));
                  }}
                  className="text-sm text-[#D82027] hover:underline"
                >
                  刪除
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-full">
                <Label
                  text="分類標題"
                  htmlFor={`category-title-${index}`}
                  required
                />
                <Input
                  name={`category-title-${index}`}
                  id={`category-title-${index}`}
                  placeholder="例如：認識比特幣"
                  value={category.title}
                  onChange={(e) =>
                    updateCategory(index, { title: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Label
                  text="小標（可留空）"
                  htmlFor={`category-label-${index}`}
                />
                <Input
                  name={`category-label-${index}`}
                  id={`category-label-${index}`}
                  placeholder="例如：比特幣技術資訊"
                  value={category.label}
                  onChange={(e) =>
                    updateCategory(index, { label: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 分類底下的文章 */}
            <div className="flex flex-col gap-2">
              <Label
                text={`文章（${category.posts.length}）`}
                htmlFor={`category-posts-${index}`}
              />

              {category.posts.length === 0 && (
                <span className="text-xs text-[#7C7C7C]">尚未加入文章</span>
              )}

              <ul className="flex flex-col gap-2">
                {category.posts.map((post, postIndex) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: 同一篇文章可能重複出現
                    key={postIndex}
                    className="flex items-center justify-between gap-3 border-[1px] border-neutral-200 rounded-sm px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-[#1A1A1A]">
                        {post.title}
                      </span>
                      <span className="text-xs text-[#7C7C7C]">
                        /moreBTC/{post.filename}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        disabled={postIndex === 0}
                        onClick={() =>
                          updateCategory(index, {
                            posts: move(
                              category.posts,
                              postIndex,
                              postIndex - 1,
                            ),
                          })
                        }
                        className="text-sm text-[#0E0E0E] hover:underline disabled:opacity-30 disabled:no-underline"
                      >
                        上移
                      </button>
                      <button
                        type="button"
                        disabled={postIndex === category.posts.length - 1}
                        onClick={() =>
                          updateCategory(index, {
                            posts: move(
                              category.posts,
                              postIndex,
                              postIndex + 1,
                            ),
                          })
                        }
                        className="text-sm text-[#0E0E0E] hover:underline disabled:opacity-30 disabled:no-underline"
                      >
                        下移
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateCategory(index, {
                            posts: category.posts.filter(
                              (_, i) => i !== postIndex,
                            ),
                          })
                        }
                        className="text-sm text-[#D82027] hover:underline"
                      >
                        移除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 加入文章：選完立刻加入並重設，所以 value 恆為空字串 */}
              <div className="mt-1">
                <select
                  id={`category-posts-${index}`}
                  value=""
                  onChange={(e) => {
                    const picked = postOptions.find(
                      (post) => post.filename === e.target.value,
                    );
                    if (!picked) return;
                    updateCategory(index, {
                      posts: [
                        ...category.posts,
                        { title: picked.title, filename: picked.filename },
                      ],
                    });
                  }}
                  className="appearance-none w-full max-w-[400px] py-2 pl-3 pr-8 text-sm font-normal leading-6 border-[1px] border-[#D3D3D3] rounded-md text-[#999999] focus:outline-none focus:border-[#0E0E0E] focus:ring-[1px] focus:ring-[#0E0E0E]"
                >
                  <option value="">＋ 加入文章</option>
                  {postOptions.map((post) => (
                    <option key={post.id} value={post.filename}>
                      {post.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={() =>
              setCategories([...categories, emptyCategory(categories.length)])
            }
            className="border-[1px] border-[#0E0E0E] rounded-lg py-[9px] px-6 text-base font-medium leading-6 text-[#0E0E0E] bg-white hover:bg-gray-50"
          >
            新增分類
          </button>
        </div>
      </div>

      {/* 確定按鈕置底 */}
      <div className="pt-20">
        <div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-end gap-2 pr-7">
            <AddBtn
              label={saving ? "儲存中…" : "儲存"}
              onClick={saving ? () => {} : handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoManage;
