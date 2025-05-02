import Image from "next/image";

const LoginPage = () => { 
  return (
    <>
      <div className="bg-white text-black grid grid-cols-2">
        <div className="justify-self-center">
          <Image
            src="/images/login.png"
            alt="login"
            width={100}
            height={10}
            className="object-cover"
          />
          <p className="font-bold text-[32px] leading-12">Welcome!</p>
        </div>
        <div>sd</div>
      </div>
    </>
  )
}

export default LoginPage;