"use client";

import AddBtn from "@/components/Button/AddBtn";
import DeleteBtn from "@/components/Button/DeleteBtn";
import DateSelection from "@/components/Input/DateSelection";
// import DropDown from "@/components/Input/DropDown";
import SafeDropDownTag from "@/components/Input/SafeDropDownTag";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import UploadFile from "@/components/UploadFile/UploadFile";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import MarkdownEditor from "@/components/Markdown/MarkdownEditor";
import DropDownTag from "@/components/Input/DropDownTag";
import { useParams } from "next/navigation";
import DropDown from "@/components/Input/DropDown";
import type { AuthorData } from "@/types/Author/Author";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const EditPost = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  // const [selectedOption, setSelectedOption] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState<AuthorData>();
  // const [markdown, setMarkdown] = useState("");
  const [authorOption, setAuthorOption] = useState<AuthorData[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);	// all tags
  const [typeOptions, setTypeOptions] = useState<string[]>([]);	// all types
  const [previewUrl, setPreviewUrl] = useState<string>(""); // 顯示舊圖或新圖
  const [filename, setFilename] = useState<string>(""); // 儲存初始的檔案名稱
  const [markdownContent, setMarkdownContent] = useState<string>(""); // markdown content

  // console.log(markdown);

  // 處理路由變化
  const router = useRouter();

  // get postID
  const params = useParams();
  const postID = params?.postID as string;

  const fetchAuthorByUID = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/author/getAuthorByUID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: id }),
      });
      const result = await res.json();
      if (result.success) return result.data;
      console.error("getAuthorByUID 失敗", result.error);
      return null;
    } catch (error) {
      console.error("API 錯誤", error);
      return null;
    }
  }, []);

  // 作者資料擷取
  const fetchAuthors = useCallback(async () => {
    const res = await fetch("/api/author/getAuthor");
    const result = await res.json();

    if (result.success) {
      // console.log("作者資料：", result.data);
      setAuthorOption(result.data);
    } else {
      console.error("取得失敗：", result.error);
    }
  }, []); // 無依賴

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/Post/getPostByID", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: postID }),
        });
        const result = await res.json();
        if (result.success) {
          const post = result.data;
          // 將資料塞入各個 state
          setTitle(post.title);
          setDescription(post.description);
          setSelectedTags(post.tags || []);
          setSelectedType(post.type || []);
          setDate(new Date(post.created_at));
          setFilename(post.filename || "");

          // 作者
          const authorData = await fetchAuthorByUID(post.author_id);
          if (authorData) {
            setAuthor(authorData);
          }

          // 如果有 image，你可以處理預覽（如用 URL blob）
          if (post.img) {
            setPreviewUrl(post.img);
          }

          // 下載 Markdown 內容
          if (post.filename) {
            const supabase = createClient();
            // 使用 getPublicUrl 加上 timestamp 避免快取
            const { data: publicUrlData } = supabase.storage
              .from("post.article")
              .getPublicUrl(post.filename, {
                download: true,
              });

            // 加上 timestamp 破壞快取
            const urlWithCacheBusting = `${publicUrlData.publicUrl}?t=${Date.now()}`;

            try {
              const response = await fetch(urlWithCacheBusting);
              if (response.ok) {
                const text = await response.text();
                setMarkdownContent(text);
                // console.log("下載的 Markdown 內容：", text);
              } else {
                console.error("下載 Markdown 失敗：HTTP", response.status);
              }
            } catch (error) {
              console.error("下載 Markdown 失敗：", error);
            }
          }

          // console.log("讀取成功", post);
        } else {
          console.error("讀取失敗", result.error);
        }
      } catch (err) {
        console.error("API 錯誤", err);
      }
    };

    if (postID) {
      fetchPost();
    }
  }, [postID, fetchAuthorByUID]);

  // useEffect(() => {
  // 	console.log("title", title);
  // }, [title]);

  // const ArticleType = [
  //   'News',
  //   'Post'
  // ];

  // 日期選擇的值
  const [date, setDate] = useState<Date | undefined>(undefined);
  // console.log("date", date);

  // useEffect(() => {
  //   console.log("imageFile", imageFile);
  // }, [imageFile]);

  // useEffect(() => {
  //   if (selectedOption) {
  //     console.log(`真正選到的文章類型: ${selectedOption}`);
  //   }
  // }, [selectedOption]);

  // 處理日期選擇的取消按鈕點擊事件
  const handleDateCancel = () => {
    setDate(undefined);
    // console.log("日期選擇取消");
  };

  // 處理日期選擇的變化
  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    // console.log(`選擇的日期: ${selected}`);
  };

  // // 處理下拉選單的選擇
  // const handleSelect = (option: string) => {
  //   setSelectedOption(option);
  //   console.log(`選擇的文章類型: ${option}`);
  // };

  // // 處理取消按鈕的點擊事件
  // const handleDropDownCancel = () => {
  //   setSelectedOption("All");
  // }

  // 標籤資料擷取
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags/Posts/getTags");
        const result = await res.json();

        if (result.success) {
          setTagOptions(result.tags); // 設定下拉選單
        } else {
          console.error("取得標籤失敗：", result.error);
        }
      } catch (err) {
        console.error("標籤 API 錯誤：", err);
      }
    };

    fetchTags();
  }, []);

  // 類型資料擷取
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/types/Posts/getTypes");
        const result = await res.json();

        if (result.success) {
          setTypeOptions(result.types); // 設定下拉選單
        } else {
          console.error("取得類型失敗：", result.error);
        }
      } catch (err) {
        console.error("類型 API 錯誤：", err);
      }
    };

    fetchTypes();
  }, []);

  // 提交編輯
  const handleSubmit = async () => {
    if (!title || !description || !author) {
      alert("請填寫完整欄位");
      return;
    }

    const formData = new FormData();

    formData.append("id", postID); // 更新必填
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("type", JSON.stringify(selectedType));
    formData.append("author_id", author.id);
    formData.append("filename", filename); // 現有的 markdown 檔名
    formData.append("markdownContent", markdownContent); // Markdown 內容

    // 如果有新圖片才 append
    if (imageFile) {
      formData.append("image", imageFile);
      formData.append("img", previewUrl);
    } else {
      formData.append("img", previewUrl);
    }

    const res = await fetch("/api/Post/editPost", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      // console.log("文章更新成功！");
      router.push("/Manage/Post");
      router.refresh(); // 強制刷新頁面資料
    } else {
      console.error("更新失敗：", result.error);
    }
  };

  // 刪除文章
  const handleDelete = async () => {
    if (!confirm("確定要刪除此文章嗎？")) {
      return;
    }

    const res = await fetch("/api/Post/delPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [postID] }),
    });

    const result = await res.json();
    if (result.success) {
      alert("文章刪除成功！");
      router.push("/Manage/Post");
      router.refresh();
    } else {
      console.error("刪除失敗：", result.error);
      alert(`刪除失敗：${result.error}`);
    }
  };

  return (
    <>
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
              value={title}
              name={"title"}
              id={"title"}
              placeholder={"請輸入標題"}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              id={"description"}
              placeholder={"請輸入文章描述"}
              onChange={(e) => setDescription(e.target.value)}
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
            <DropDown
              options={authorOption.map((author) => author.name)}
              selectedOption={author?.name || ""}
              label_name={"請選擇作者"}
              onSelect={(option: string) =>
                setAuthor(authorOption.find((author) => author.name === option))
              }
              onCancel={() => { }}
            />
          </div>

          <div className="flex gap-5">
            {/* 標籤 */}
            <div className="flex flex-col gap-2 w-full">
              <Label
                text={"標籤"}
                htmlFor={"tag"}
                required={true}
                className={"mb-2"}
              />
              <div>
                <SafeDropDownTag
                  options={tagOptions}
                  selectedOptions={selectedTags}
                  onChange={setSelectedTags}
                />
              </div>
            </div>

            {/* 類型 */}
            <div className="flex flex-col gap-2 w-full">
              <Label
                text={"類型"}
                htmlFor={"type"}
                required={true}
                className={"mb-2"}
              />

              <div>
                <DropDownTag
                  options={typeOptions}
                  selectedOptions={selectedType}
                  onChange={setSelectedType}
                />
              </div>
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
            <div>
              <DateSelection
                selected={date}
                onSelect={handleDateSelect}
                onCancel={handleDateCancel}
              />
            </div>
          </div>

          {/* 封面圖 */}
          <div className="flex flex-col gap-0 grow w-[502px]">
            <Label text="封面圖上傳" htmlFor="image" required />
            <span className="text-xs text-[#7C7C7C] mb-2">
              僅限上傳 .jpg、.png 檔案
            </span>

            {
              previewUrl && (
                <UploadFile
                  previewUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post.image/${previewUrl}`}
                  onChange={(file) => {
                    setImageFile(file);
                  }}
                  onDrop={(file) => {
                    setImageFile(file);
                    setPreviewUrl("");
                  }}
                />
              )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              text={"文章內容"}
              htmlFor={"date"}
              required={false}
              className={"mb-2"}
            />
            <div>
              <MarkdownEditor
                value={markdownContent}
                onChange={(value) => setMarkdownContent(value || "")}
              />
            </div>
          </div>
        </div>

        {/* 確定按鈕置底 */}
        <div className="pt-20">
          <div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
            <div className="flex justify-end gap-2 pr-7">
              <DeleteBtn
                label="刪除"
                onClick={handleDelete}
              />
              <AddBtn
                label="發佈"
                onClick={handleSubmit}
              />
              <Link
                href="/Manage/Post"
                className="border-[1px] border-[#D3D3D3] cursor-grab hover:bg-gray-50 bg-white py-[9px] px-6 rounded-lg text-base font-medium leading-6 text-[#7C7C7C]"
              >
                取消
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPost;
