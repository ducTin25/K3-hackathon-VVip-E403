import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "VLearn Knowledge Pulse",
  description: "Quiz thích ứng và bản đồ lỗ hổng kiến thức cho lớp học VLearn.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
