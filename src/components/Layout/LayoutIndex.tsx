import type { LayoutIndexProps } from "@/types/Layout/LayoutIndex";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

// icon
import NewsIcon from "@/images/news_icon.svg";
import PostIcon from "@/images/post_icon.svg";
import AuthorIcon from "@/images/author_icon.svg";

const LayoutIndex = (props: LayoutIndexProps) => {
	const item = [
		{ name: "新聞管理", path: "/Manage/News", icon: NewsIcon },
		{ name: "文章管理", path: "/Manage/Post", icon: PostIcon },
		{ name: "作者管理", path: "/Manage/Author", icon: AuthorIcon },
	];
	return (
		<div className="flex min-h-screen h-full bg-[#F3F7FA]">
			<Sidebar items={item} />
			<div className="flex flex-col flex-1 overflow-hidden ml-64">
				<Navbar
					title={props.title}
					logo={props.logo}
					userName={"測試"}
					className="px-4"
				/>
				<div className="flex-1 overflow-y-auto p-4">
					<div className="flex flex-col min-h-full p-4 border-gray-200 border-dashed rounded-lg bg-white relative">
						{props.children}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LayoutIndex;
