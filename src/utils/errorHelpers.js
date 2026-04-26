export const translateError = (error) => {
  if (!error) return null;

  // Если ошибка уже строка
  if (typeof error === "string") {
    if (error === "Incorrect password" || error === "User not found") {
      return "Неверный логин или пароль";
    }
    if (error === "Email already registered") {
      return "Этот email уже зарегистрирован";
    }
    return error;
  }

  // Если это массив ошибок валидации (как на скриншотах)
  if (Array.isArray(error)) {
    return error.map((err) => {
      const field = err.loc ? err.loc[err.loc.length - 1] : "";
      const type = err.type;

      switch (type) {
        case "string_too_short":
          if (field === "password") {
            return "Пароль должен содержать минимум одну заглавную букву, цифру и специальный символ";
          }
          return `Поле "${field}" должно содержать минимум ${err.ctx?.min_length || "?"} симв.`;
        case "value_error.any_str.pattern":
        case "assertion_error":
          if (field === "password") {
            return "Пароль должен содержать минимум одну заглавную букву, цифру и специальный символ";
          }
          return err.msg || "Некорректный формат";
        case "value_error.email":
          return "Некорректный формат email";
        case "value_error.missing":
          return `Поле "${field}" обязательно для заполнения`;
        default:
          if (field === "password") {
            return "Пароль должен содержать минимум одну заглавную букву, цифру и специальный символ";
          }
          return err.msg || "Ошибка валидации";
      }
    }).join(", ");
  }

  // Если это объект с detail (FastAPI)
  if (error.detail) {
    return translateError(error.detail);
  }

  return "Произошла непредвиденная ошибка";
};
