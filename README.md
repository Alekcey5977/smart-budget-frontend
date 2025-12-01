# Smart Budget – frontend

**Smart Budget**.  
Сейчас в проекте настроены базовые вещи:

- React + Vite
- Redux Toolkit для управления состоянием приложения
- Хранение информации о текущем пользователе и его авторизованности

Дальше на этой базе будут разрабатываться экраны авторизации, регистрации и основного приложения.

---

## Стек

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/) – сборка и dev-сервер
- [Redux Toolkit](https://redux-toolkit.js.org/) – стор и слайсы
- [React Redux](https://react-redux.js.org/) – привязка стора к React
- [Prettier](https://prettier.io/) – автоформатирование кода

---

## Структура проекта

smart-budget-frontend/
src/
│
├── app/ - Главные файлы приложения
│ ├── App.jsx - Основной компонент приложения
│ ├── App.css - Стили App
│ ├── index.css - Глобальные стили
│ └── main.jsx - Точка входа
│
└── store/ -
├── auth/ - Фича авторизации
│ ├── authSlice.js - Slice авторизации
│ └── authSelectors.js - Селекторы для auth
│
└── store.js - состояние проекта
