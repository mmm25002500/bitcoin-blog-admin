import LoginBtn from "@/components/button/LoginBtn";
import RememberMe from "@/components/CheckBox/RememberMe";
import EmailInput from "@/components/Input/Email";
import PasswordInput from "@/components/Input/Password";
import Image from "next/image";
import { useState } from "react";
import bg from "@/images/bg.png";
import icon from "@/images/icon_dark.svg";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // 處理電子郵件輸入
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(email);
    setEmail(e.target.value);
  }

  // 處理密碼輸入
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(password);
    setPassword(e.target.value);
  }

  // 處理記住我選項
  const handleRememberMeChange = (checked: boolean) => {
    console.log(rememberMe);
    setRememberMe(checked);
  }

  // 處理登入按鈕點擊
  const handleLoginClick = () => {
    console.log("Login clicked");
  }

  return (
    <>
      <div className="bg-white text-black grid grid-cols-2 h-screen">
        {/* 左邊 */}
        <div className="flex flex-col justify-between items-center py-8">
          {/* 圖片左上 */}
          <div className="relative w-40">
            <Image
              src={icon}
              alt="login"
              width={100}
              height={100}
              className="object-cover w-40 absolute top-10 left-0"
            />
          </div>

          {/* 登入左中 */}
          <div className="flex flex-col gap-8 justify-center items-center grow">
            <p className="font-bold text-[32px] leading-12">Welcome!👋</p>
            <div className="flex flex-col gap-4 w-[360px]">
              <EmailInput
                placeholder="電子郵件"
                onChange={(e) => handleEmailChange(e)}
              />
              <PasswordInput
                placeholder="輸入您的密碼"
                onChange={(e) => handlePasswordChange(e)}
              />

              <div className="flex">
                <div className="grow">
                  <RememberMe
                    checked={false}
                    onChange={(checked) => handleRememberMeChange(checked)}
                    label="記住我"
                  />
                </div>

                <div>
                  <p className="">忘記密碼</p>
                </div>
              </div>

              <LoginBtn
                label="登入"
                onClick={() => handleLoginClick()}
              />
            </div>
          </div>
        </div>

        {/* 右邊 */}
        <div className="relative w-full h-full">
          <Image
            src={bg}
            alt="login"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </>
  )
}

export default LoginPage;