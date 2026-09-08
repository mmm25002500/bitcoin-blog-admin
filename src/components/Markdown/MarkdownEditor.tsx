"use client";

import dynamic from "next/dynamic";

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
}

/**
 * @uiw/react-md-editor 整包約 400 kB，只有編輯頁用得到。
 * 這裡用 next/dynamic 切成獨立 chunk，避免打進首屏。
 *
 * 注意：實作要放在 MarkdownEditorInner，這個檔案不能有任何
 * 來自 @uiw/react-md-editor 的靜態 import，否則整包又會被拉回主 bundle
 * （原本 `import { commands } from '@uiw/react-md-editor'` 就是這樣讓
 * dynamic 失效的）。
 */
const MarkdownEditorInner = dynamic(() => import("./MarkdownEditorInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 500 }}
      className="w-full rounded-md border border-[#D3D3D3] bg-[#FAFAFA] flex items-center justify-center text-sm text-[#999999]"
    >
      編輯器載入中…
    </div>
  ),
});

export default function MarkdownEditor(props: MarkdownEditorProps) {
  return <MarkdownEditorInner {...props} />;
}
