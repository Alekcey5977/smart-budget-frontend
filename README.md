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
├─ src/
│ ├─ app/
│ │ └─ store/ - стор, селекторы
│ ├─ features/
│ │ └─ auth/ - authSlice - слайс для авторизации
│ ├─ App.jsx
│ └─ main.jsx - входная точка приложения
├─ .prettierrc.json - настройки Prettier
├─ package.json
└─ README.md
