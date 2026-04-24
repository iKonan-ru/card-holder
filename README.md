# Card Holder

[![CI](https://github.com/iKonan-ru/card-holder/actions/workflows/ci.yml/badge.svg)](https://github.com/iKonan-ru/card-holder/actions/workflows/ci.yml)
[![Test Coverage](https://img.shields.io/badge/coverage-98.44%25-brightgreen.svg)](./coverage)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)

Offline PWA-приложение для управления информацией о банковских картах с хранением в IndexedDB.

## Особенности

- **Безопасное локальное хранение** - все данные хранятся только в вашем браузере (IndexedDB)
- **Работает offline** - полная функциональность без интернета
- **PWA** - устанавливается как нативное приложение на любое устройство
- **Современный UI** - адаптивный дизайн с поддержкой тёмной темы
- **Перетаскивание** - изменение порядка карт drag & drop
- **Быстрое копирование** - копирование одним кликом номера, CVV, PIN
- **Автоопределение банка** - по BIN номера карты
- **Поддержка платежных систем** - Visa, Mastercard, Мир и другие
- **Валидация (Zod)** - схемы для полей карты и пароля экспорта, номер - по алгоритму Луна
- **Высокое покрытие тестами** - >90% покрытие кода

## Дисклеймер

Это приложение предназначено для хранения информации о картах **локально на вашем устройстве**.
Все данные хранятся только в IndexedDB вашего браузера и никуда не отправляются.
Не используйте это приложение на общедоступных или ненадёжных устройствах.

## Технологический стек

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **Zustand** - управление состоянием
- **Less** - CSS препроцессор
- **React Icons** - иконки
- **Vitest** - тестирование
- **React Testing Library** - тестирование React компонентов
- **Zod** - схемы валидации полей (форма карты, пароль при экспорте/импорте)
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

Проект имеет высокое покрытие тестами с использованием Vitest и React Testing Library.

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

**Важно**: Тесты автоматически запускаются перед каждой полной сборкой (`npm run build`). Если нужно собрать без тестов, используйте `npm run build:no-test`.

## Структура проекта (FSD)

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

Проект следует архитектуре FSD для обеспечения:

- Масштабируемости кода
- Независимости модулей
- Легкости поддержки и тестирования

### Технические решения

**Хранение данных:**

- **IndexedDB** - надёжное клиентское хранилище
- **Zustand** - минималистичный state management
- **Offline-first** - работа без интернета

**PWA:**

- Service Worker для кэширования
- Web App Manifest для установки
- Полная offline функциональность

**Качество:**

- TypeScript в strict mode
- ESLint + Prettier
- [Zod](https://zod.dev/) - валидация ввода по схемам (`card-form`, `card-export-import`)
- Высокое покрытие тестами

### Валидация (Zod)

- **Форма карты** - `src/features/card-form/utils/schemas.ts`: PAN (алгоритм Луна), срок, имя, CVV, опциональный PIN; сборка `cardFormSchema`
- **Экспорт/импорт** - `src/features/card-export-import/utils/schemas.ts`: пароль и подтверждение (`exportPasswordSchema`)
- Сообщения об ошибках задаются в константах features и маппятся на поля через `use-card-form` и `field-validators`

---
