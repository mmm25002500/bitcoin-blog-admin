'use client';
import { SidebarProps } from '@/types/Sidebar/Sidebar';
import { useRouter } from 'next/router';
import Image from 'next/image';
import icon from "@/images/icon_dark.svg";
// TODO：改用 APP Router！

const Sidebar = (props: SidebarProps) => {
  const router = useRouter();
  console.log('Sidebar', router.pathname);

  return (
    <>
      <div className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#F3F7FA]">
          <Image
            src={icon}
            alt="login"
            width={100}
            height={100}
            className="object-cover w-40 mb-10"
            priority       // 告訴 Next.js 這張圖是高優先
            loading="eager"// 立刻載入
          />

          <ul className="space-y-2 font-medium">
            {
              props.items.map((item) => (
                item.path == router.pathname ? (
                  // 當前位置
                  <li key={item.name}>
                    <button onClick={() => router.push(item.path)} className="flex items-center p-2 bg-black/5 rounded-lg group w-full">
                      <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                      </svg>
                      <span className="ms-3 font-medium text-base leading-6 text-[#3C3C3C]">{item.name}</span>
                    </button>
                  </li>
                ) : (
                  // 其他位置
                  <li key={item.name}>
                    <button onClick={() => router.push(item.path)} className="flex items-center p-2 text-gray-900 hover:bg-black/10 rounded-lg group w-full">
                      <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                      </svg>
                      <span className="ms-3 font-medium text-base leading-6 text-[#040404]">{item.name}</span>
                    </button>
                  </li>
                )
              ))
            }

          </ul>
        </div>
      </div >
    </>
  );
}

export default Sidebar;