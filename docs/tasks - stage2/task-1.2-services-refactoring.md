# Задача 1.2: Реорганизация сервисов для устранения дублирования

## Описание

В текущей реализации сервисного слоя приложения присутствует дублирование кода для типовых операций с Firestore и других паттернов доступа к данным. Необходимо реорганизовать сервисный слой, удалив дублирование и создав базовые классы для типовых операций, что повысит поддерживаемость кода и уменьшит вероятность ошибок.

## Шаги выполнения

1. **Анализ текущих сервисов:**
   - Проанализировать существующие сервисы (`progress-service.ts`, `level-service.ts`, `artifact-service.ts` и другие)
   - Выявить общие паттерны и дублирующийся код
   - Составить список типовых операций, которые часто повторяются

2. **Создание базового сервисного класса:**
   - Создать директорию `src/lib/services/base`
   - Реализовать базовый класс `BaseService` с методами для типовых CRUD операций
   - Обеспечить типизацию и гибкость расширения

3. **Реализация специализированных базовых сервисов:**
   - Создать `DocumentService` для операций с документами
   - Создать `CollectionService` для операций с коллекциями
   - Реализовать вспомогательные методы для часто используемых операций

4. **Рефакторинг существующих сервисов:**
   - Переписать существующие сервисы с использованием новых базовых классов
   - Сохранить существующий API для обратной совместимости
   - Удалить дублирующийся код

5. **Тестирование рефакторинга:**
   - Обновить существующие тесты в соответствии с новой структурой
   - Добавить тесты для базовых сервисных классов
   - Проверить, что все существующие функциональные тесты проходят

## Пример структуры базового сервиса

```typescript
// src/lib/services/base/base-service.ts
import { FirestoreService } from '@/lib/api/interfaces/firestore';
import { ApiFactory } from '@/lib/api/factory';

export abstract class BaseService<T> {
  protected firestoreService: FirestoreService;
  protected collectionName: string;

  constructor(collectionName: string) {
    this.firestoreService = ApiFactory.getFirestoreService();
    this.collectionName = collectionName;
  }

  async getById(id: string): Promise<T | null> {
    return this.firestoreService.getDocumentById<T>(this.collectionName, id);
  }

  async getAll(): Promise<T[]> {
    return this.firestoreService.getCollection<T>(this.collectionName);
  }

  async create(id: string, data: T): Promise<void> {
    return this.firestoreService.createDocument(this.collectionName, id, data);
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    return this.firestoreService.updateDocument(this.collectionName, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.deleteDocument(this.collectionName, id);
  }
}
```

## Пример рефакторинга сервиса уровней

```typescript
// src/lib/services/level-service.ts
import { BaseService } from './base/base-service';
import { Level } from '@/types/level';
import { ApiFactory } from '@/lib/api/factory';

class LevelService extends BaseService<Level> {
  constructor() {
    super('levels');
  }

  async getLevels(): Promise<Level[]> {
    // Специфичный для уровней код получения данных
    const levels = await this.getAll();
    return levels.sort((a, b) => a.order - b.order);
  }

  async getNextLevelId(currentLevelId: string): Promise<string | null> {
    // Специфичный метод для уровней
    const levels = await this.getLevels();
    const currentIndex = levels.findIndex(level => level.id === currentLevelId);
    
    if (currentIndex === -1) {
      throw new Error(`Уровень с ID ${currentLevelId} не найден`);
    }
    
    if (currentIndex === levels.length - 1) {
      return null; // Это последний уровень
    }
    
    return levels[currentIndex + 1].id;
  }
}

export const levelService = new LevelService();
```

## Рекомендации

1. Придерживайтесь принципа DRY (Don't Repeat Yourself)
2. Используйте наследование и композицию для выделения общих функций
3. Сохраняйте обратную совместимость API для минимизации изменений в клиентском коде
4. Документируйте публичные методы сервисов
5. Используйте TypeScript для улучшения типобезопасности

## Ожидаемый результат

- Набор базовых сервисных классов для типовых операций
- Рефакторинг существующих сервисов с использованием новых базовых классов
- Удаление дублирующегося кода
- Сохранение существующего API для клиентского кода
- Обновленные тесты, подтверждающие корректность рефакторинга

## Ресурсы

- [Принцип DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [Паттерн Template Method](https://refactoring.guru/design-patterns/template-method)
- [Паттерн Factory Method](https://refactoring.guru/design-patterns/factory-method)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 