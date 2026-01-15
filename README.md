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

src/
app/
App.jsx
AppRouter.jsx
main.jsx
global.scss
index.html
theme/
Tbank.js

    PrivateRoute/
      PrivateRoute.jsx
      index.js

layout/
PhoneLayout/
PhoneLayout.jsx
PhoneLayout.module.scss
index.js

    UnauthLayout/
      UnauthLayout.jsx
      UnauthLayout.module.scss
      index.js

    AuthLayout/
      AuthLayout.jsx
      AuthLayout.module.scss
      index.js

ui/
AppButton/
AppButton.jsx
index.js

    AppTextField/
      AppTextField.jsx
      index.js

styles/
colors.scss
