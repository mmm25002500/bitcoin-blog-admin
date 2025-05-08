import { LayoutIndexProps } from "@/types/Layout/LayoutIndex";
import Sidebar from "../Sidebar/Sidebar";

const LayoutIndex = (props: LayoutIndexProps) => {

  const item = [
    { name: '新聞管理', path: '/NewsManage', icon: '' },
    { name: '文章管理', path: '/PageManage', icon: '' },
    { name: '作者管理', path: '/AuthorManage', icon: '' }
  ];
  return (
    <>
      <Sidebar
        items={item}
      />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          { props.children }
        </div>
      </div>
    </>
  );
}

export default LayoutIndex;