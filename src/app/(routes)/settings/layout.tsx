import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Настройки | BizLevel",
  description: "Настройки пользователя и приложения BizLevel",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 