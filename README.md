# Card Holder

[![CI](https://github.com/YOUR_USERNAME/card-holder/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/card-holder/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-98.44%25-brightgreen.svg)](./coverage)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)

Безопасное offline PWA-приложение для управления информацией о банковских картах с хранением в IndexedDB.

## Особенности

- **Безопасное локальное хранение** - все данные хранятся только в вашем браузере (IndexedDB)
- **Работает offline** - полная функциональность без интернета
- **PWA** - устанавливается как нативное приложение на любое устройство
- **Современный UI** - адаптивный дизайн с поддержкой темной темы
- **Перетаскивание** - изменение порядка карт drag & drop
- **Быстрое копирование** - одним кликом копируйте номер, CVV, PIN
- **Автоопределение банка** - по BIN номеру карты
- **Поддержка платежных систем** - Visa, Mastercard, Мир и другие
- **Валидация** - проверка номера карты по алгоритму Луна
- **Высокое покрытие тестами** - 98.44% code coverage

## Дисклеймер

Это приложение предназначено для безопасного хранения информации о картах **локально на вашем устройстве**.
Все данные хранятся только в IndexedDB вашего браузера и никуда не отправляются.
Не используйте это приложение на общедоступных или ненадежных устройствах.

## Технологический стек

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **Zustand** - управление состоянием
- **Less** - CSS препроцессор
- **React Icons** - иконки
- **Vitest** - тестирование
- **React Testing Library** - тестирование React компонентов
- **PWA** - Progressive Web App (работа offline, установка на устройство)

## Быстрые команды

```bash
npm run fix    # Исправить форматирование + линтер
npm run test   # Запустить тесты
npm run build  # Собрать проект
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Сборка в single file
npm run build:single

# Превью production сборки
npm run preview

# Линтинг
npm run lint          # Проверка линтера
npm run lint:fix      # Автоисправление линтера

# Форматирование кода (Prettier)
npm run format        # Проверка форматирования
npm run format:fix    # Исправить форматирование

# Исправить всё (форматирование + линтер)
npm run fix           # Форматирование + автоисправление линтера
```

## Тестирование

Проект имеет высокое покрытие тестами с использованием Vitest и Testing Library.

### Команды для тестирования

```bash
# Запуск всех тестов
npm run test

# Запуск тестов в watch-режиме
npm run test:watch

# Запуск тестов с UI
npm run test:ui

# Генерация отчета о покрытии
npm run test:coverage
```

**Важно**: Тесты автоматически запускаются перед каждой сборкой (`npm run build`). Если нужно собрать без тестов, используйте `npm run build:no-test`.

## Структура проекта (FSD)

Проект следует архитектуре **Feature-Sliced Design** для масштабируемости и поддерживаемости кода.

```
src/
├── app/           # Инициализация приложения, провайдеры
├── pages/         # Страницы приложения
├── widgets/       # Композитные блоки (списки, формы)
├── features/      # Функциональность (управление картами, PWA)
├── entities/      # Бизнес-сущности (карты, банки)
├── shared/        # Переиспользуемый код
│   ├── ui/        # UI компоненты (Modal, Portal, FormField)
│   ├── lib/       # Утилиты, хуки, контексты
│   ├── data/      # Данные и константы
│   └── assets/    # Статические файлы (иконки, стили)
└── test/          # Тестовая инфраструктура
```

## Архитектура

### Feature-Sliced Design (FSD)

Проект следует современной архитектуре FSD для обеспечения:

- Масштабируемости кода
- Независимости модулей
- Легкости поддержки и тестирования

### Технические решения

**Хранение данных:**

- **IndexedDB** - надежное клиентское хранилище
- **Zustand** - минималистичный state management
- **Offline-first** - работа без интернета

**PWA:**

- Service Worker для кэширования
- Web App Manifest для установки
- Полная offline функциональность

**Качество:**

- TypeScript в strict mode
- ESLint + Prettier
- 98.44% test coverage
- 497 unit тестов

## Контрибуция

Приветствуются любые виды вклада! Пожалуйста:

1. Форкните репозиторий
2. Создайте feature-ветку (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Требования к PR:

- Все тесты должны проходить (`npm test`)
- Линтинг без ошибок (`npm run lint`)
- Покрытие новой функциональности тестами
- Обновление документации при необходимости

## Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](./LICENSE).

## Благодарности

- Иконки банков и платежных систем
- React и TypeScript сообществу
- Всем контрибьюторам проекта

---

**Сделано с использованием React 19 + TypeScript + Vite**
