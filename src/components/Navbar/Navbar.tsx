"use client";

import type { NavbarProps } from "@/types/Navbar/Navbar";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "nextjs-toploader/app";
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

// image
import NoHead from "@/images/NoHead.png";

const handleUser = async () => {
	const supabase = createClient();

	// 這裡只是要顯示 email，用 getSession 直接讀本機 cookie 即可，
	// 不必每次載入都打一趟 auth server（getUser 約 120ms）。
	// 真正的權限把關在 middleware（頁面）與各 API 路由。
	const { data, error } = await supabase.auth.getSession();

	if (error || !data.session?.user) {
		return null;
	}

	return data.session.user;
};

const Navbar = (props: NavbarProps) => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);

	// nextjs-toploader 的 useRouter 每次 render 都回傳新物件，
	// 不能放進 deps，否則會 getUser -> setUser -> re-render -> getUser 無限迴圈。
	const routerRef = useRef(router);
	routerRef.current = router;

	useEffect(() => {
		let cancelled = false;

		handleUser().then((userData) => {
			if (cancelled) return;
			if (userData) {
				setUser(userData);
			} else {
				routerRef.current.push("/login");
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div
			className={`w-full h-[68px] bg-[#F3F7FA] flex items-center ${props.className}`}
		>
			{/* 左邊 ICON */}
			<div>
				<Image
					src={props.logo}
					alt="login"
					width={20}
					height={20}
					className="w-5 h-5 mr-3"
					priority
					loading="eager"
				/>
			</div>

			{/* 左邊標題 */}
			<div className="grow">
				<p className="text-xl font-medium leading-[30px] text-[#040404]">
					{props.title}
				</p>
			</div>

			{/* 右邊頭貼 */}
			<div className="">
				<Image
					src={NoHead}
					alt="login"
					width={20}
					height={20}
					className="w-5 h-5 mr-3"
					priority
					loading="eager"
				/>
			</div>

			{/* 右邊使用者名稱 */}
			<div className="flex gap-2">
				<p className="text-base font-medium leading-[24px] text-[#040404]">
					{user?.email}
				</p>
				<p className="text-[#7C7C7C] text-base">▼</p>
			</div>
		</div>
	);
};

export default Navbar;
