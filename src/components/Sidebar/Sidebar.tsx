"use client";
import type { SidebarProps } from "@/types/Sidebar/Sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import icon from "@/images/icon_dark.svg";

const Sidebar = (props: SidebarProps) => {
	const pathname = usePathname();

	return (
		<div className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform translate-x-0">
			<div className="h-full px-3 py-4 overflow-y-auto bg-[#F3F7FA]">
				<Image
					src={icon}
					alt="login"
					width={100}
					height={100}
					className="object-cover w-40 mb-10"
					priority
					loading="eager"
				/>

				<ul className="space-y-2 font-medium">
					{props.items.map((item) => {
						const isActive = item.path === pathname;
						return (
							<li key={item.name}>
								<Link
									href={item.path}
									className={`flex items-center p-2 rounded-lg group w-full ${
										isActive ? "bg-black/5" : "text-gray-900 hover:bg-black/10"
									}`}
								>
									<Image
										src={item.icon}
										alt="login"
										width={10}
										height={10}
										className="w-5 h-5"
										priority
										loading="eager"
									/>
									<span className="ms-3 font-medium text-base leading-6 text-[#3C3C3C]">
										{item.name}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
