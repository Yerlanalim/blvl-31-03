# Задача 1.6: Улучшение UI-компонентов и устранение избыточных элементов

## Описание

В проекте наблюдается дублирование UI-компонентов и неоптимальное использование компонентов из библиотеки shadcn/ui. Некоторые компоненты в директории `components/ui` дублируют функциональность shadcn/ui, а другие содержат избыточный код. Необходимо провести аудит и оптимизацию UI-компонентов, устранить дублирование и создать более гибкие и переиспользуемые компоненты.

## Шаги выполнения

1. **Аудит существующих UI-компонентов:**
   - Проанализировать директорию `components/ui`
   - Сравнить с компонентами из библиотеки shadcn/ui
   - Выявить дублирующие компоненты и компоненты с избыточным кодом

2. **Реорганизация структуры UI-компонентов:**
   - Создать директорию `components/common` для составных компонентов
   - Разделить компоненты на базовые (из shadcn/ui) и составные (специфичные для приложения)
   - Определить стратегию для миграции компонентов

3. **Оптимизация базовых компонентов:**
   - Удалить компоненты, дублирующие функциональность shadcn/ui
   - Модифицировать компоненты shadcn/ui только при необходимости
   - Создать расширенные версии базовых компонентов с дополнительной функциональностью

4. **Создание общих составных компонентов:**
   - Выявить повторяющиеся паттерны UI в приложении
   - Создать составные компоненты для этих паттернов
   - Обеспечить гибкость настройки и хорошую документацию

5. **Рефакторинг страниц и компонентов:**
   - Обновить импорты и использование компонентов
   - Внедрить новые составные компоненты
   - Удалить неиспользуемый код

## Пример оптимизации компонента формы

```tsx
// Было: src/components/ui/input.tsx (дублирует shadcn/ui)
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-500" : ""
        } ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

```tsx
// Стало: src/components/common/FormInput.tsx (составной компонент, использующий shadcn/ui)
import * as React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  className = "",
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <Input
            placeholder={placeholder}
            type={type}
            {...field}
            disabled={disabled}
            className={fieldState.error ? "border-red-500" : ""}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

## Пример составного компонента для карточек

```tsx
// src/components/common/Card/index.tsx
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  isLoading?: boolean;
}

export function ContentCard({
  title,
  description,
  footer,
  headerAction,
  children,
  isLoading = false,
  className,
  ...props
}: CardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)} {...props}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      
      {(title || description || headerAction) && (
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </CardHeader>
      )}
      
      {children && <CardContent>{children}</CardContent>}
      
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

// Экспортируем также базовые компоненты для гибкости
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
```

## Пример использования составных компонентов

```tsx
// src/components/features/LevelMap/LevelCard.tsx
import { ContentCard } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Level } from "@/types/level";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface LevelCardProps {
  level: Level;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
}

export function LevelCard({ level, isActive, isCompleted, isLocked }: LevelCardProps) {
  const router = useRouter();
  
  // Определяем статус уровня для отображения
  const status = isCompleted 
    ? "completed" 
    : isActive 
      ? "active" 
      : "locked";
  
  // Разные варианты отображения бейджа
  const badges = {
    completed: <Badge variant="success">Завершен</Badge>,
    active: <Badge variant="default">Доступен</Badge>,
    locked: <Badge variant="outline">Заблокирован</Badge>
  };
  
  return (
    <ContentCard
      title={level.title}
      description={`Уровень ${level.order}`}
      headerAction={badges[status]}
      footer={
        <Button 
          variant={isLocked ? "outline" : "default"}
          disabled={isLocked}
          onClick={() => router.push(`/level/${level.id}`)}
          className="w-full"
        >
          {isCompleted ? "Повторить" : isActive ? "Начать" : "Заблокирован"}
        </Button>
      }
      className="card transition-all hover:shadow-md"
      data-testid={`level-card-${level.id}`}
      data-status={status}
    >
      <p className="text-sm text-muted-foreground">{level.description}</p>
    </ContentCard>
  );
}
```

## Рекомендации

1. Используйте компоненты из shadcn/ui как основу и расширяйте их только при необходимости
2. Создавайте составные компоненты для повторяющихся паттернов UI
3. Используйте TypeScript для обеспечения типобезопасности пропсов
4. Применяйте композицию компонентов вместо наследования
5. Документируйте компоненты и их пропсы с примерами использования

## Ожидаемый результат

- Оптимизированная структура директории `components`
- Удаленные дублирующие компоненты
- Новые составные компоненты для типовых паттернов UI
- Обновленные страницы и компоненты, использующие новую структуру
- Уменьшенный размер кодовой базы и бандла

## Ресурсы

- [Документация shadcn/ui](https://ui.shadcn.com/)
- [Принципы композиции компонентов в React](https://reactjs.org/docs/composition-vs-inheritance.html)
- [Паттерны проектирования React](https://reactpatterns.com/)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 