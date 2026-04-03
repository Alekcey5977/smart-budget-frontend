import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["History"],
  endpoints: (builder) => ({
    getHistory: builder.query({
      query: () => ({
        url: "/history/user/me",
        method: "GET",
      }),
      providesTags: ["History"],
    }),
    getHistoryById: builder.query({
      query: (id) => ({
        url: `/history/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "History", id }],
    }),
  }),
});

export const { useGetHistoryQuery, useGetHistoryByIdQuery } = historyApi;
