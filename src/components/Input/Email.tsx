import { EmailInputProps } from "@/types/Input/EmailInput";

const EmailInput = (props: EmailInputProps) => {
  return (
    <>
      <input
        type="email"
        placeholder={props.placeholder}
        className={`border-[1px] rounded-[6px] p-2 border-[#D3D3D3] bg-white ${props.className}`}
        onChange={(e) => props.onChange(e)}
      />
    </>
  )
}

export default EmailInput;