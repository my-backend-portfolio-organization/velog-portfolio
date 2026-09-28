import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JINSU.DEV — Backend Portfolio",
  description: "복잡한 도메인을 안정적인 시스템으로 구현하는 백엔드 개발자 김진수의 포트폴리오입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" suppressHydrationWarning><body>{children}</body></html>;
}
