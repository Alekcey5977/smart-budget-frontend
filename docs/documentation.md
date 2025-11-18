# Документация к макетам приложения
# Документ описывает, какие данные нужны на экранах приложения
# и в каком виде они будут отправляться на бэкенд.


Формат строк: `поле: тип — обязательное|не обязательное // описание`


## 02 — Вход (Авторизация)
```
email: string — обязательное // почта пользователя («Введите вашу почту»)
password: string — обязательное // пароль пользователя («Введите ваш пароль»)
```


## 03 — Регистрация — Шаг 1
```
regEmail: string —  не обязательное // почта («Введите вашу почту»)
regPassword: string — обязательное // пароль («Введите ваш пароль»)
regPasswordRepeat: string — обязательное // повтор пароля
```


## 04 — Регистрация — Шаг 2
```
lastName: string — обязательное // фамилия
firstName: string — обязательное // имя
middleName: string — не обязательное // отчество
```


## 05 — Профиль
```
profileLastName: string — обязательное // фамилия
profileFirstName: string — обязательное // имя
profileMiddleName: string — не обязательное // отчество
profileEmail: string — обязательное // почта
```


## 10 — Конкретная цель
```
nameGoal: string — не обязательное // наименование цели
Deadeline: date — обязательное // дедлайн по дате( до какой даты должна быть закрыта цель )
HaveSumm: int — обязательное // накопленная сумма
FinalySumm: int — обязательное // Итоговая сумма цели
```

## 11_Цель_Создание
```
nameGoal: string — не обязательное // наименование цели
Deadeline: date — обязательное // дедлайн по дате( до какой даты должна быть закрыта цель )
HaveSumm: int — обязательное // накопленная сумма
FinalySumm: int — обязательное // Итоговая сумма цели
```

## 13_Создание_Расход
```
nameOperation: string - обязательное // название операции по расходу
summa: int - Обязательное // сумма расхода
category: string - обязательное // по какой категории произошёл расход
date: date - обязательное // дата расхода
```

## 16_Поиск_по_категориям
```
StartSumm: int - не обязательное // начальная сумма фильтра
EndSumm: int - не обязательное // конечная сумма фильтра
```



# Что отправляем на бэкенд 

## LoginPayload (Вход)
```
email: string — обязательное // из 02 — Вход → email
password: string — обязательное // из 02 — Вход → password
```

## RegisterPayload (регистрация)
```
email: string — обязательное // из 03 — regEmail
password: string — обязательное // из 03 — regPassword
lastName: string — обязательное // из 04 — lastName
firstName: string — обязательное // из 04 — firstName
middleName: string — не обязательное // из 04 — middleName
```

## ProfileUpdatePayload (Профиль — сохранение)
```
lastName: string — обязательное // из 05 — profileLastName
firstName: string — обязательное // из 05 — profileFirstName
middleName: string — не обязательное // из 05 — profileMiddleName
email: string — обязательное // из 05 — profileEmail
```

## CategoryCreatePayload (Категории — добавление новой)
```
name: string — обязательное // из 07 — newCategoryName
```
