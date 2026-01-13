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
app/
App.jsx # Корневой компонент приложения

    AppRouter.jsx # Описание маршрутов (Routes/Route): какие страницы открываются по каким URL.

    main.jsx # Точка входа

hoc/
PrivateRoute.jsx # обёртка для защиты приватных роутов: проверяет авторизацию

    layout/

    PhoneLayout/

      PhoneLayout.jsx # Layout "телефона": задаёт одинаковые размеры/позиционирование/контейнер для всех экранов.

      PhoneLayout.module.scss # Стили PhoneLayout: фон страницы, размеры "телефона", скругления, паддинги и т.п.

    UnauthLayout.jsx # Лейаут неавторизованной зоны

    UnauthLayout.module.scss # Стили UnauthLayout

pages/
LoginPage/
LoginPage.jsx # Страница авторизации

      LoginPage.module.scss # Стили LoginPage

    WelcomePage/
      WelcomePage.jsx # Приветственная страница

      WelcomePage.module.scss # Стили WelcomePage

store/
auth/
authSlice.js # slice авторизации

      authSelectors.js # Селекторы для auth slice

    store.js # Конфигурация Redux store (configureStore) и подключение редьюсеров.

theme/
Tbank.js # MUI тема

colors.scss # Общие SCSS-переменные (цвета/константы)
