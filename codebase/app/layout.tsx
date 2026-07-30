import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "VLearn Knowledge Pulse",
  description: "Tạo quiz có căn cứ từ slide và nhận gợi ý ôn tập cá nhân hóa bằng AI.",
  openGraph: {
    title: "VLearn Knowledge Pulse",
    description: "Quiz từ slide, chấm điểm theo luật và nhận xét kiến thức bằng AI.",
    images: ["/vlearn-quiz-og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
