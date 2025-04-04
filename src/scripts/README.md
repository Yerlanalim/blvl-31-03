# Scripts для проекта BizLevel

В этой директории находятся скрипты для настройки и управления данными для проекта BizLevel.

## populate-levels.js

Скрипт для заполнения Firestore тестовыми данными о уровнях, видео, тестах и артефактах.

### Подготовка

1. Необходимо создать сервисный аккаунт в Firebase:
   - Откройте [Firebase Console](https://console.firebase.google.com/) и выберите ваш проект
   - Перейдите в раздел **Project Settings** (Настройки проекта)
   - Откройте вкладку **Service accounts** (Сервисные аккаунты)
   - Нажмите **Generate new private key** (Создать новый приватный ключ)
   - Скачанный файл JSON переименуйте в `serviceAccountKey.json` и поместите в директорию `src/scripts/`

2. Убедитесь, что у вас установлена библиотека firebase-admin:
   ```
   npm install firebase-admin
   ```

### Запуск

Для запуска скрипта выполните:

```bash
cd /path/to/project
node src/scripts/populate-levels.js
```

### Что делает скрипт

- Создает 5 тестовых уровней с видеоконтентом, тестами и связями с артефактами
- Создает 10 тестовых артефактов для скачивания
- Использует batch-запись для эффективной загрузки данных
- Выводит информацию о процессе заполнения данных и инструкции для проверки

### Данные

В скрипте создаются следующие тестовые уровни:

1. **Основы бизнес-мышления**
   - 3 видео
   - 1 тест (2 вопроса)
   - 2 артефакта

2. **Финансовая грамотность**
   - 3 видео
   - 2 теста (3 вопроса)
   - 2 артефакта

3. **Маркетинг и продажи**
   - 4 видео
   - 1 тест (2 вопроса)
   - 2 артефакта

4. **Лидерство и командная работа**
   - 3 видео
   - 1 тест (2 вопроса)
   - 2 артефакта

5. **Стратегическое планирование**
   - 3 видео
   - 1 тест (2 вопроса)
   - 2 артефакта

### Безопасность

**Важно:** Файл `serviceAccountKey.json` содержит приватные ключи доступа к вашему проекту Firebase. Никогда не храните его в репозитории и не передавайте третьим лицам.

Для безопасности добавьте `src/scripts/serviceAccountKey.json` в файл `.gitignore`.

### Проверка результатов

После успешного запуска скрипта:

1. Откройте [Firebase Console](https://console.firebase.google.com/) и выберите ваш проект
2. Перейдите в раздел **Firestore Database**
3. Убедитесь, что коллекции `levels` и `artifacts` содержат загруженные данные 