import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Мок для next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
}));

// Создаем QueryClient для тестов
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
});

// Опции для рендеринга с провайдерами
interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  queryClient?: QueryClient;
  router?: {
    push?: () => void;
    back?: () => void;
    pathname?: string;
  };
}

// Компонент обертки для провайдеров
function TestProviders({ 
  children,
  queryClient = createTestQueryClient(),
}: { 
  children: ReactNode;
  queryClient?: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Функция для рендеринга компонента с провайдерами
function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  const rendered = render(ui, {
    wrapper: ({ children }) => (
      <TestProviders queryClient={queryClient}>
        {children}
      </TestProviders>
    ),
    ...renderOptions,
  });

  return {
    ...rendered,
    user: userEvent.setup(),
    rerender: (ui: ReactElement) => renderWithProviders(ui, options),
  };
}

// Мок для userProgress
const mockUserProgress = {
  currentLevelId: 'level-1',
  completedLevelIds: [],
  watchedVideoIds: [],
  completedTestIds: [],
  downloadedArtifactIds: [],
  skillProgress: {},
  badges: [],
};

// Экспортируем утилиты
export { renderWithProviders, createTestQueryClient, mockUserProgress }; 