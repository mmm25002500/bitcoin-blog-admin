"use client";

import Image from "next/image";
import { useRef } from "react";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import {
  MAX_ARTICLE_BUTTONS,
  type ArticleButtonInput,
  type ButtonsEditorProps,
} from "@/types/Article/ArticleButton";

const emptyButton = (): ArticleButtonInput => ({
  title: "",
  description: "",
  logo: "",
  link: "",
  logoFile: null,
});

// 單一按鈕的 logo 選擇（小張預覽 + 選擇檔案）
const LogoPicker = ({
  logo,
  logoFile,
  bucket,
  onPick,
  onClear,
}: {
  logo: string;
  logoFile?: File | null;
  bucket: string;
  onPick: (file: File) => void;
  onClear: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = logoFile
    ? URL.createObjectURL(logoFile)
    : logo
      ? /^https?:\/\//.test(logo)
        ? logo
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${logo}`
      : "";

  return (
    <div className="flex items-center gap-3">
      <div className="w-[60px] h-[60px] shrink-0 rounded-md border-[1px] border-neutral-200 bg-[#F3F4F8] flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="logo"
            width={60}
            height={60}
            unoptimized
            className="object-contain w-full h-full p-1"
          />
        ) : (
          <span className="text-[10px] text-[#7C7C7C]">無</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border-[1px] border-[#0E0E0E] cursor-pointer hover:bg-gray-50 bg-white py-[5px] px-3 rounded-sm text-sm font-medium leading-6 text-[#0E0E0E]"
        >
          選擇 Logo
        </button>
        {(logo || logoFile) && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[#D82027] hover:underline text-left"
          >
            移除
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file?.type.startsWith("image/")) {
            onPick(file);
          }
          e.target.value = "";
        }}
      />
    </div>
  );
};

const ButtonsEditor = (props: ButtonsEditorProps) => {
  const buttons = props.value;

  const update = (index: number, patch: Partial<ArticleButtonInput>) => {
    props.onChange(
      buttons.map((btn, i) => (i === index ? { ...btn, ...patch } : btn)),
    );
  };

  const remove = (index: number) => {
    props.onChange(buttons.filter((_, i) => i !== index));
  };

  const add = () => {
    if (buttons.length >= MAX_ARTICLE_BUTTONS) return;
    props.onChange([...buttons, emptyButton()]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label text="文章底部按鈕" htmlFor="buttons" />
        <span className="text-xs text-[#7C7C7C]">
          最多 {MAX_ARTICLE_BUTTONS} 個，前台每排顯示三個（目前 {buttons.length}/
          {MAX_ARTICLE_BUTTONS}）
        </span>
      </div>

      {buttons.map((btn, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: 順序即身分，無穩定 id
          key={index}
          className="border-[1px] border-neutral-200 rounded-md p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-800">
              按鈕 {index + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-sm text-[#D82027] hover:underline"
            >
              刪除
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-full">
              <Label text="標題" htmlFor={`button-title-${index}`} required />
              <Input
                name={`button-title-${index}`}
                id={`button-title-${index}`}
                placeholder="請輸入按鈕標題"
                value={btn.title}
                onChange={(e) => update(index, { title: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label
                text="描述"
                htmlFor={`button-description-${index}`}
              />
              <Input
                name={`button-description-${index}`}
                id={`button-description-${index}`}
                placeholder="請輸入按鈕描述"
                value={btn.description}
                onChange={(e) => update(index, { description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label text="連結" htmlFor={`button-link-${index}`} required />
            <Input
              name={`button-link-${index}`}
              id={`button-link-${index}`}
              placeholder="https://example.com 或 /Post/1"
              value={btn.link}
              onChange={(e) => update(index, { link: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label text="Logo" htmlFor={`button-logo-${index}`} />
            <LogoPicker
              logo={btn.logo}
              logoFile={btn.logoFile}
              bucket={props.bucket}
              onPick={(file) => update(index, { logoFile: file })}
              onClear={() => update(index, { logo: "", logoFile: null })}
            />
          </div>
        </div>
      ))}

      <div>
        <button
          type="button"
          onClick={add}
          disabled={buttons.length >= MAX_ARTICLE_BUTTONS}
          className="border-[1px] border-[#0E0E0E] rounded-lg py-[9px] px-6 text-base font-medium leading-6 text-[#0E0E0E] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          新增按鈕
        </button>
      </div>
    </div>
  );
};

export default ButtonsEditor;
