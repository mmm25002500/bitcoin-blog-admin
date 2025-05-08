import { RememberMeProps } from "@/types/CheckBox/RememberMe";

const RememberMe = (props: RememberMeProps) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        value={props.checked ? "true" : "false"}
        onChange={(e) => { props.onChange(e.target.checked); }}
        id="rememberMe"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-[#4A4A4A] rounded"
      />
      <label
        htmlFor="rememberMe"
        className="ml-2 text-sm font-normal text-[#4A4A4A]"
      >
        {props.label || "記住我"}
      </label>
    </div>
  );
}

export default RememberMe;