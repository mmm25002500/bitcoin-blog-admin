import type { NavbarProps } from "@/types/Navbar/Navbar";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "nextjs-toploader/app";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// image
import NoHead from "@/images/NoHead.png";

const handleUser = async () => {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		return null;
	}

	return data.user;
};

const Navbar = (props: NavbarProps) => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		handleUser().then((userData) => {
			if (userData) {
				setUser(userData);
			} else {
				router.push("/login");
			}
		});
	}, [router]);

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
