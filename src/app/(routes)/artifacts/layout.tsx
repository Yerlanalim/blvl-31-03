import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Артефакты | BizLevel',
  description: 'Скачивайте полезные артефакты для вашего бизнеса',
};

export default function ArtifactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 