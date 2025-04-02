import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профиль | BizLevel',
  description: 'Ваш профиль и статистика на платформе BizLevel',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 