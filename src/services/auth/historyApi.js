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
  }),
});

export const { useGetHistoryQuery } = historyApi;
