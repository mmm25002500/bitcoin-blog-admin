import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "tjdnszvgfvxoxdangdhu.supabase.co", // 換成你的專案 domain
				pathname: "/storage/v1/object/public/**",
			},
		],
	},
};

export default nextConfig;
