'use client';
// import { useRouter } from "next-nprogress-bar";
// import Link from "next/link";

import { useRouter } from 'nextjs-toploader/app';

const MyComponent = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/')}>
      前往作者管理
    </button>
    // <Link href="/">sd</Link>
  );
};

export default MyComponent;