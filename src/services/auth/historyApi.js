import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery"; // Предполагаем, что путь остался прежним

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: axiosBaseQuery(),
  // Объявляем теги для автоматического обновления данных, если потребуется
  tagTypes: ["History"],
  endpoints: (builder) => ({
    // Получить всю историю пользователя (системные уведомления)
    getHistory: builder.query({
      query: () => ({
        url: "/history/user/me", // Эндпоинт, который ты указывал для истории
        method: "GET",
      }),
      providesTags: ["History"],
    }),
    // Дополнительные эндпоинты для истории, если они будут
    // Например, getHistoryItemById, deleteHistoryItem и т.д.
  }),
});

export const {
  useGetHistoryQuery,
  // Экспортируй другие хуки, если добавишь эндпоинты
} = historyApi;
