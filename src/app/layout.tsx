import type { Metadata } from "next";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: "manage setting",
	description: "",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="overflow-x-auto">
				<NextTopLoader color="#F7931A" />
				<Toaster position="top-center" reverseOrder={false} />

				<div id="responsive-wrapper">{children}</div>
			</body>
		</html>
	);
}
