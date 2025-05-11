import DateSelection from "@/components/Input/DateSelection";
import LayoutIndex from "@/components/Layout/LayoutIndex";

// icon
import AuthorIcon from "@/images/author_icon.svg";

const AuthrorManage = () => {
  return (
    <LayoutIndex title="作者管理" logo={AuthorIcon}>
      <></>
      <DateSelection />
    </LayoutIndex>
  );
}

export default AuthrorManage;