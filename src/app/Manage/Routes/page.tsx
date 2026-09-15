"use client";

import { useCallback, useEffect, useState } from "react";
import Input from "@/components/Input/Input";

interface PageRoute {
  key: string;
  label: string;
  path: string;
}

// 後台只改第一段路徑，例如 /aboutus → /about；
// 文章、新聞的個別網址在各自的編輯頁設定
const RoutesManage = () => {
  const [routes, setRoutes] = useState<PageRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRoutes = useCallback(async () => {
    try {
      const res = await fetch("/api/pageRoute/getRoutes");
      const result = await res.json();

      if (result.success) {
        setRoutes(
          (result.data || []).map(
            (route: { key: string; label: string; path: string | null }) => ({
              key: route.key,
              label: route.label,
              path: route.path || "",
            }),
          ),
        );
      } else {
        console.error("取得網址設定失敗：", result.error);
        alert(`取得網址設定失敗：${result.error}`);
      }
    } catch (err) {
      console.error("網址設定 API 錯誤：", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const updatePath = (key: string, path: string) => {
    setRoutes((prev) =>
      prev.map((route) => (route.key === key ? { ...route, path } : route)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/pageRoute/saveRoutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routes: routes.map((route) => ({
            key: route.key,
            path: route.path.trim() || null,
          })),
        }),
      });
      const result = await res.json();

      if (result.success) {
        alert("已儲存，前台約 1 分鐘內生效");
        fetchRoutes();
      } else {
        alert(`儲存失敗：${result.error}`);
      }
    } catch (err) {
      console.error("儲存網址設定錯誤：", err);
      alert("儲存失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-neutral-500">載入中…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-neutral-500">
        留空表示使用原本的網址。改了之後，原本的網址會自動轉到新網址，
        已經分享出去的連結不會失效。只能填一段，不能有 / ? # % . 或空白。
      </p>

      <div className="flex flex-col divide-y divide-neutral-100">
        {routes.map((route) => {
          const current = route.path.trim().replace(/^\/+|\/+$/g, "");

          return (
            <div
              key={route.key}
              className="grid grid-cols-1 md:grid-cols-[10rem_12rem_1fr] items-center gap-3 py-4"
            >
              <p className="text-sm font-medium text-[#1A1A1A]">{route.label}</p>
              <p className="text-sm text-neutral-500">原本：/{route.key}</p>
              <div className="flex flex-col gap-1">
                <Input
                  value={route.path}
                  name={`route-${route.key}`}
                  id={`route-${route.key}`}
                  placeholder={route.key}
                  onChange={(e) => updatePath(route.key, e.target.value)}
                />
                <p className="text-xs text-neutral-400">
                  前台網址：/{current || route.key}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-sm bg-[#1A1A1A] text-white text-sm disabled:opacity-50"
        >
          {saving ? "儲存中…" : "儲存"}
        </button>
      </div>
    </div>
  );
};

export default RoutesManage;
